//! 설정: 환경 변수에서 읽고, 없으면 기본값을 쓴다.
//!
//! | 이름           | 기본값        | 뜻 |
//! |----------------|---------------|----|
//! | `HOST`         | `127.0.0.1`   | 듣는 주소. 같은 Wi-Fi의 휴대폰을 받으려면 `0.0.0.0` |
//! | `PORT`         | `8080`        | 포트 |
//! | `DATABASE_URL` | (없음)        | PostgreSQL 주소. 없으면 랭킹을 끈다 |
//! | `STATIC_DIR`   | `client/dist` | 빌드된 클라이언트(html·js) 폴더 |

use std::net::IpAddr;
use std::path::PathBuf;

#[derive(Debug, Clone, PartialEq)]
pub struct Config {
    pub host: IpAddr,
    pub port: u16,
    pub database_url: Option<String>,
    pub static_dir: PathBuf,
}

impl Config {
    /// 진짜 환경 변수에서 읽는다.
    pub fn from_env() -> Result<Config, String> {
        Config::from_vars(|key| std::env::var(key).ok())
    }

    /// `get(이름)`으로 값을 찾는다. 테스트에서는 가짜 값을 넣을 수 있다.
    pub fn from_vars(get: impl Fn(&str) -> Option<String>) -> Result<Config, String> {
        // 빈 문자열("")은 "설정 안 함"과 같게 본다.
        let read = |key: &str| get(key).filter(|value| !value.trim().is_empty());

        let host = match read("HOST") {
            Some(value) => value.trim().parse().map_err(|_| {
                format!("HOST={value} 는 IP 주소가 아니에요(예: 127.0.0.1, 0.0.0.0)")
            })?,
            None => IpAddr::from([127, 0, 0, 1]),
        };
        let port = match read("PORT") {
            Some(value) => value
                .trim()
                .parse()
                .map_err(|_| format!("PORT={value} 는 0~65535 사이 숫자여야 해요"))?,
            None => 8080,
        };
        let database_url = read("DATABASE_URL");
        let static_dir =
            PathBuf::from(read("STATIC_DIR").unwrap_or_else(|| "client/dist".to_string()));

        Ok(Config {
            host,
            port,
            database_url,
            static_dir,
        })
    }
}

#[cfg(test)]
mod tests {
    use super::*;
    use std::collections::HashMap;

    fn config_with(pairs: &[(&str, &str)]) -> Result<Config, String> {
        let vars: HashMap<String, String> = pairs
            .iter()
            .map(|(k, v)| (k.to_string(), v.to_string()))
            .collect();
        Config::from_vars(|key| vars.get(key).cloned())
    }

    #[test]
    fn defaults_are_local_only_without_database() {
        let config = config_with(&[]).unwrap();
        assert_eq!(config.host, IpAddr::from([127, 0, 0, 1]));
        assert_eq!(config.port, 8080);
        assert_eq!(config.database_url, None);
        assert_eq!(config.static_dir, PathBuf::from("client/dist"));
    }

    #[test]
    fn values_come_from_environment() {
        let config = config_with(&[
            ("HOST", "0.0.0.0"),
            ("PORT", "3000"),
            ("DATABASE_URL", "postgres://u:p@localhost/db"),
            ("STATIC_DIR", "/srv/client"),
        ])
        .unwrap();
        assert!(config.host.is_unspecified());
        assert_eq!(config.port, 3000);
        assert_eq!(
            config.database_url.as_deref(),
            Some("postgres://u:p@localhost/db")
        );
        assert_eq!(config.static_dir, PathBuf::from("/srv/client"));
    }

    #[test]
    fn empty_database_url_means_disabled() {
        assert_eq!(
            config_with(&[("DATABASE_URL", "")]).unwrap().database_url,
            None
        );
    }

    #[test]
    fn bad_values_are_errors() {
        assert!(config_with(&[("PORT", "eighty")]).is_err());
        assert!(config_with(&[("PORT", "70000")]).is_err());
        assert!(config_with(&[("HOST", "localhost")]).is_err());
    }
}
