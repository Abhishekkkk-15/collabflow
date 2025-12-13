function WORKSPACE_INVITE_TEMPLATE(
  workspaceName: string,
  inviterName: string,
  inviterEmail: string,
  inviterAvatar: string,
  workspaceAvatar: string,
  inviteeName: string,
  inviteeEmail: string,
  inviteUrl: string,
  year = new Date().getFullYear()
) {
  return `
    
    <!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN"
  "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html lang="en" dir="ltr">
  <head>
    <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
    <meta name="x-apple-disable-message-reformatting" />
    <title>Workspace Invitation</title>
  </head>

  <body
    style="
      background-color:#ffffff;
      margin:0;
      padding:0;
      font-family: ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont,
        'Segoe UI', Roboto, 'Apple Color Emoji', 'Segoe UI Emoji';
    ">

    <!-- Outer container -->
    <table width="100%" cellpadding="0" cellspacing="0" role="presentation">
      <tr>
        <td align="center" style="padding:32px 12px">

          <!-- Card -->
          <table
            width="100%"
            cellpadding="0"
            cellspacing="0"
            role="presentation"
            style="
              max-width:460px;
              border:1px solid #eaeaea;
              border-radius:8px;
              padding:24px;
            ">

            <!-- Logo -->
            <tr>
              <td align="center" style="padding-top:8px">
                <img
                  src="https://your-cdn.com/collabflow-logo.png"
                  width="40"
                  height="40"
                  alt="CollabFlow"
                  style="display:block;border-radius:8px" />
              </td>
            </tr>

            <!-- Title -->
            <tr>
              <td
                align="center"
                style="
                  padding-top:24px;
                  font-size:22px;
                  font-weight:500;
                  color:#000000;
                ">
                Join <strong>${workspaceName}</strong> on <strong>CollabFlow</strong>
              </td>
            </tr>

            <!-- Greeting -->
            <tr>
              <td style="padding-top:24px;font-size:14px;color:#000000">
                Hello <strong>${inviteeName}</strong>,
              </td>
            </tr>

            <!-- Body -->
            <tr>
              <td style="padding-top:12px;font-size:14px;line-height:22px;color:#000000">
                <strong>${inviterName}</strong>
                (<a
                  href="mailto:{{inviterEmail}}"
                  style="color:#2563eb;text-decoration:none"
                >${inviterEmail}</a>)
                has invited you to join the workspace
                <strong>${workspaceName}</strong> on CollabFlow.
              </td>
            </tr>

            <!-- Avatars row -->
            <tr>
              <td style="padding-top:24px">
                <table width="100%" role="presentation">
                  <tr>
                    <td align="right" width="45%">
                      <img
                        src="${inviterAvatar}"
                        width="56"
                        height="56"
                        alt="Inviter"
                        style="border-radius:9999px;display:block" />
                    </td>
                    <td align="center" width="10%">
                      →
                    </td>
                    <td align="left" width="45%">
                      <img
                        src="${workspaceAvatar}"
                        width="56"
                        height="56"
                        alt="Workspace"
                        style="border-radius:9999px;display:block" />
                    </td>
                  </tr>
                </table>
              </td>
            </tr>

            <!-- CTA -->
            <tr>
              <td align="center" style="padding-top:32px">
                <a
                  href="${inviteUrl}"
                  target="_blank"
                  style="
                    background:#000000;
                    color:#ffffff;
                    padding:12px 20px;
                    border-radius:6px;
                    font-size:13px;
                    font-weight:600;
                    text-decoration:none;
                    display:inline-block;
                  ">
                  Join workspace
                </a>
              </td>
            </tr>

            <!-- Fallback link -->
            <tr>
              <td style="padding-top:24px;font-size:13px;color:#000000">
                Or copy and paste this URL into your browser:
                <br />
                <a
                  href="${inviteUrl}"
                  style="color:#2563eb;text-decoration:none"
                  target="_blank"
                >
                  ${inviteUrl}
                </a>
              </td>
            </tr>

            <tr>
              <td>
                <hr
                  style="
                    border:none;
                    border-top:1px solid #eaeaea;
                    margin:32px 0;
                  " />
              </td>
            </tr>

            <!-- Footer -->
            <tr>
              <td style="font-size:12px;color:#666666;line-height:18px">
                This invitation was intended for
                <strong>${inviteeEmail}</strong>.
                If you weren’t expecting this invitation, you can safely ignore
                this email.
                <br /><br />
                © ${year} CollabFlow
              </td>
            </tr>

          </table>
        </td>
      </tr>
    </table>
  </body>
</html>

    `;
}
