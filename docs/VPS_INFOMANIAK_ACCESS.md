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
