# VPS Infomaniak access

Operational notes for connecting to the EPiC VPS on Infomaniak.

## Server

- Provider: Infomaniak
- SSH user: `ubuntu`
- Host/IP: `179.237.107.160`

## Private key

The private key must stay outside `app/`, because `app/` is the Git repository that gets pushed.

Current local path:

```powershell
C:\Users\simone\Dropbox\kh-libreria\EPiC model\workspace\private\keys\simonegenini-infomaniak
```

The root `.gitignore` excludes `workspace/private/`, so the key is protected if the project root is ever versioned. Do not copy the key into `app/`.

## SSH command

From the project root:

```powershell
ssh -i ".\workspace\private\keys\simonegenini-infomaniak" ubuntu@179.237.107.160
```

From anywhere:

```powershell
ssh -i "C:\Users\simone\Dropbox\kh-libreria\EPiC model\workspace\private\keys\simonegenini-infomaniak" ubuntu@179.237.107.160
```

On first connection, SSH asks to trust the host fingerprint. Answer `yes` only if the host/IP is the expected VPS.

## Windows key permissions

If SSH refuses the key with:

```text
WARNING: UNPROTECTED PRIVATE KEY FILE
Bad permissions
```

restrict the file ACLs. This was needed because `CodexSandboxUsers` had access to the key.

PowerShell:

```powershell
$key = "C:\Users\simone\Dropbox\kh-libreria\EPiC model\workspace\private\keys\simonegenini-infomaniak"

icacls $key /inheritance:r
icacls $key /remove "DESKTOP-2IJDMUC\CodexSandboxUsers"
icacls $key /remove "Users"
icacls $key /remove "Authenticated Users"
icacls $key /grant "simone:(F)"
```

The `/grant "$env:USERNAME:(F)"` form may fail on this Windows setup; using the explicit local username `simone` worked.

Then retry:

```powershell
ssh -i $key ubuntu@179.237.107.160
```

## Security notes

- Never commit private keys.
- Never paste the private key into docs, tickets, chat, or code.
- If the key is exposed, revoke it from the VPS/provider and generate a new one.
- Prefer one key per deployment/admin context so access can be rotated cleanly.

## EPiC deployment state

Initial VPS setup was started on July 26, 2026.

Production is live at:

```text
https://simonegenini.com
```

Canonical host:

```text
simonegenini.com
```

`www.simonegenini.com` redirects permanently to `https://simonegenini.com/`.

Current server layout:

```text
/opt/epic/app
```

Runtime:

- Python app: FastAPI served by Uvicorn
- service name: `epic-web`
- internal listen address: `127.0.0.1:8080`
- reverse proxy: Caddy with automatic Let's Encrypt HTTPS
- access log database: `/opt/epic/app/var/access_log.sqlite3`

Public routes:

```text
/                 -> public Simone Genini homepage
/epic             -> EPiC landing page
/epic/simulator   -> public simulator demo
/epic/explorer    -> public explorer demo
/epic/cards       -> public cards demo
/health           -> service health check
```

Useful checks on the server:

```bash
cd /opt/epic/app
./server/deploy.sh
curl http://127.0.0.1:8080/health
curl http://127.0.0.1/health
curl https://simonegenini.com/health
sudo systemctl status epic-web --no-pager
sudo systemctl status caddy --no-pager
journalctl -u epic-web -n 100 --no-pager
journalctl -u caddy -n 100 --no-pager
```

Expected health response:

```json
{"status":"healthy","service":"epic-web"}
```

## Deploy procedure

Normal deploy after pushing to GitHub:

```bash
ssh -i "C:\Users\simone\Dropbox\kh-libreria\EPiC model\workspace\private\keys\simonegenini-infomaniak" ubuntu@179.237.107.160
cd /opt/epic/app
./server/deploy.sh
```

`deploy.sh` currently does:

- `git pull --ff-only origin main`
- create/update the Python virtualenv if needed
- install `server/requirements.txt`
- restart `epic-web`
- retry local `/health`
- print systemd service status

Check deployed commit:

```bash
cd /opt/epic/app
git log -1 --oneline
git status --short --branch
```

## DNS and firewall

Cloudflare DNS records:

```text
simonegenini.com      A      179.237.107.160
www.simonegenini.com  CNAME  simonegenini.com
```

The BIND import file used during setup is kept outside the deployable app:

```text
workspace/dns/simonegenini.com.zone
```

Infomaniak VPS firewall inbound rules:

```text
TCP   22    all sources    SSH
TCP   80    all sources    HTTP
TCP   443   all sources    HTTPS
ICMP        all sources    ICMP
```

Ports `80` and `443` are required for Caddy and Let's Encrypt validation.

Temporary Caddy mode:

```text
server/infra/Caddyfile.http-bootstrap.example
```

This serves plain HTTP on port 80 and responds by direct IP. It is useful before DNS is fully pointed to the VPS.

Final Caddy mode:

```text
server/infra/Caddyfile.example
```

This is the active production mode. It lets Caddy obtain and renew HTTPS certificates automatically.

Production checks that passed on July 26, 2026:

```text
https://simonegenini.com/health        200
https://simonegenini.com/              200
https://simonegenini.com/epic          200
https://simonegenini.com/epic/simulator 200
https://www.simonegenini.com           301 -> https://simonegenini.com/
```
