export function MAGIC_LINK_TEMPLATE({
  email,
  url,
}: {
  email: string;
  url: string;
}) {
  return `
<!DOCTYPE html>
<html>
  <body style="font-family:system-ui;background:#fff">
    <table align="center" width="100%" style="max-width:460px;border:1px solid #eaeaea;border-radius:8px;padding:24px">
      <tr>
        <td align="center">
          <h2>Sign in to CollabFlow</h2>
        </td>
      </tr>
      <tr>
        <td style="font-size:14px">
          Hello,<br /><br />
          Click the button below to sign in securely.
          This link will expire in <strong>10 minutes</strong>.
        </td>
      </tr>
      <tr>
        <td align="center" style="padding:24px">
          <a
            href="${url}"
            style="background:#000;color:#fff;padding:12px 20px;border-radius:6px;text-decoration:none;font-weight:600">
            Sign in
          </a>
        </td>
      </tr>
      <tr>
        <td style="font-size:12px;color:#666">
          This email was sent to ${email}.  
          If you didn’t request this, you can ignore it.
        </td>
      </tr>
    </table>
  </body>
</html>
`;
}
