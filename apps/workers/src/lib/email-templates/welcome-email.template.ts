export function WELCOME_EMAIL_TEMPLATE(
  userName: string,
  userEmail: string,
  appUrl: string,
  year = new Date().getFullYear()
) {
  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="x-apple-disable-message-reformatting" />
  <title>Welcome to CollabFlow</title>
</head>

<body style="background:#ffffff;margin:0;padding:0;font-family:ui-sans-serif,system-ui,-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto;">
  <table width="100%" role="presentation">
    <tr>
      <td align="center" style="padding:32px 12px">
        <table width="100%" role="presentation" style="max-width:460px;border:1px solid #eaeaea;border-radius:8px;padding:24px">

          <tr>
            <td align="center">
              <img src="https://res.cloudinary.com/dha7ofrer/image/upload/v1767956502/icon_zue5em.svg" width="40" height="40" style="border-radius:8px" />
            </td>
          </tr>

          <tr>
            <td align="center" style="padding-top:24px;font-size:22px;font-weight:500">
              Welcome to <strong>CollabFlow</strong>
            </td>
          </tr>

          <tr>
            <td style="padding-top:24px;font-size:14px">
              Hi <strong>${userName}</strong>,
            </td>
          </tr>

          <tr>
            <td style="padding-top:12px;font-size:14px;line-height:22px">
              We’re excited to have you onboard. CollabFlow helps you organize workspaces, manage projects, and collaborate with your team — all in one place.
            </td>
          </tr>

          <tr>
            <td align="center" style="padding-top:32px">
              <a href="${appUrl}" style="background:#000;color:#fff;padding:12px 20px;border-radius:6px;font-size:13px;font-weight:600;text-decoration:none">
                Go to dashboard
              </a>
            </td>
          </tr>

          <tr>
            <td style="padding-top:32px;font-size:12px;color:#666">
              This email was sent to <strong>${userEmail}</strong>.
              <br /><br />
              © ${year} CollabFlow
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}
