# 이미지 후원 서비스: React 빌드 + ASP.NET Core API를 이미지 하나로 만든다
# 빌드: docker compose up --build -d  (또는 docker build -t image-donation .)

# ── 1단계: React 빌드 (결과물은 ../server/ImageDonation.Api/wwwroot 로 나온다)
FROM node:26-slim AS client
WORKDIR /src/client
COPY client/package.json client/package-lock.json ./
RUN npm ci --no-audit --no-fund
COPY client/ ./
RUN npm run build

# ── 2단계: API 빌드
FROM mcr.microsoft.com/dotnet/sdk:10.0 AS server
WORKDIR /src/server
COPY server/ImageDonation.Api/ImageDonation.Api.csproj ImageDonation.Api/
RUN dotnet restore ImageDonation.Api/ImageDonation.Api.csproj
COPY server/ImageDonation.Api/ ImageDonation.Api/
RUN dotnet publish ImageDonation.Api/ImageDonation.Api.csproj -c Release -o /app --no-restore

# ── 3단계: 실행 이미지 (SDK 없이 런타임만)
FROM mcr.microsoft.com/dotnet/aspnet:10.0
WORKDIR /app
COPY --from=server /app ./
COPY --from=client /src/server/ImageDonation.Api/wwwroot ./wwwroot
# 업로드 이미지와 암호화 키를 둘 폴더. 컨테이너를 지워도 남도록 compose가 볼륨을 붙인다
RUN mkdir -p /data/media /data/keys && chown -R "$APP_UID" /data
USER $APP_UID
ENV Storage__MediaPath=/data/media \
    DataProtection__KeysPath=/data/keys
# .NET 이미지는 기본으로 8080 포트에서 듣는다 (ASPNETCORE_HTTP_PORTS=8080)
EXPOSE 8080
ENTRYPOINT ["dotnet", "ImageDonation.Api.dll"]
