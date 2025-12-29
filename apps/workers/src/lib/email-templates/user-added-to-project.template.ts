export function USER_ADDED_TO_PROJECT_TEMPLATE(
  userName: string,
  projectName: string,
  workspaceName: string,
  addedByName: string,
  projectUrl: string,
  year = new Date().getFullYear()
) {
  return `
<!DOCTYPE html>
<html>
<head><meta charset="UTF-8" /></head>

<body style="background:#ffffff;margin:0;padding:0;font-family:ui-sans-serif,system-ui">
  <table width="100%">
    <tr>
      <td align="center" style="padding:32px 12px">
        <table style="max-width:460px;border:1px solid #eaeaea;border-radius:8px;padding:24px">

          <tr>
            <td align="center">
              <img src="https://your-cdn.com/collabflow-logo.png" width="40" />
            </td>
          </tr>

          <tr>
            <td align="center" style="padding-top:24px;font-size:22px">
              Added to a project
            </td>
          </tr>

          <tr>
            <td style="padding-top:24px;font-size:14px">
              Hi <strong>${userName}</strong>,
            </td>
          </tr>

          <tr>
            <td style="padding-top:12px;font-size:14px;line-height:22px">
              <strong>${addedByName}</strong> added you to the project
              <strong>${projectName}</strong> in the workspace
              <strong>${workspaceName}</strong>.
            </td>
          </tr>

          <tr>
            <td align="center" style="padding-top:32px">
              <a href="${projectUrl}" style="background:#000;color:#fff;padding:12px 20px;border-radius:6px;font-size:13px;font-weight:600;text-decoration:none">
                View project
              </a>
            </td>
          </tr>

          <tr>
            <td style="padding-top:32px;font-size:12px;color:#666">
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
