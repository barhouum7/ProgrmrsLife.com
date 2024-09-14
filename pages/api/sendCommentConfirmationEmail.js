import nodemailer from "nodemailer";
import Cors from "cors";

// Initializing the cors middleware
const cors = Cors({
  methods: ["GET", "POST", "HEAD"],
});

const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
      user: process.env.AUTH_EMAIL_ADDRESS,
      pass: process.env.AUTH_EMAIL_PASS,
    },
  });

const handler = (req, res) => {
  // Run the cors middleware
    cors(req, res, async () => {
        try {
            const { name, email, postTitle, slug } = req.body;
            const firstName = name.split(" ")[0];
            const shortedPostTitle = postTitle.substring(0, 20);
            // Get the recipient email address from request body
            const toEmail = email;

            const mailOptions = {
            from: process.env.SENDER_EMAIL_ADDRESS,
            to: toEmail,
            subject: `👏🥳 ${firstName}, We Received Your Comment on (${shortedPostTitle}...), It'll be Published Very Soon!`,
            html: `
            <!doctypehtml>
            <html lang=en>
            <meta content="text/html; charset=UTF-8" http-equiv=Content-Type>
            <meta content="IE=edge" http-equiv=X-UA-Compatible>
            <meta content="width=device-width,initial-scale=1,minimum-scale=1" name=viewport>
            <title>👏🥳 ${firstName}, We Received Your Comment on (${shortedPostTitle}...), It'll be Published Very Soon!</title>

            <body>
                <div style="background-color:rgb(227, 222, 222);padding:25px;border-radius:30%;margin:20px;">
                    <center>
                        <div align="center">
                            <table border="0" cellspacing="0" cellpadding="0" width="100%" align="center" role="presentation"
                                style="font-family:Helvetica,Arial,serif;border-collapse:collapse;word-break:break-word">
                                <tbody>
                                    <tr>
                                        <td
                                            style="font-family:Helvetica,Arial,sans-serif;margin-bottom:30px;padding:0px;text-align:left">
                                            <div align="center">
                                                <div style="max-width:560px">
                                                    <div>
                                                        <div>
                                                            <table class="m_-2530275121054374444aw-stack"
                                                                style="width:100%;font-family:Helvetica,Arial,serif;border-collapse:collapse;word-break:break-word"
                                                                role="presentation">
                                                                <tbody>
                                                                    <tr>
                                                                        <td class="m_-2530275121054374444container"
                                                                            style="padding:0px;width:100%;font-family:Helvetica,Arial,serif"
                                                                            width="100%" valign="top">
                                                                            <div>
                                                                                <div>
                                                                                    <table align="center" width="100%"
                                                                                        style="float:none;text-align:center;font-family:Helvetica,Arial,serif;border-collapse:collapse;word-break:break-word"
                                                                                        role="presentation">
                                                                                        <tbody>
                                                                                            <tr>
                                                                                                <td align="center"
                                                                                                    style="padding:0px 0px 12px;font-family:Helvetica,Arial,serif">
                                                                                                    <a href="https://www.progrmrslife.com/"
                                                                                                        target="_blank">
                                                                                                        <img src="https://hostedimages-cdn.aweber-static.com/MjEwNDg2Ng==/original/06e6016e0f2e4e1db9196dbfa07454f2.png"
                                                                                                            style="display:block;width:100px;height:100px;border-width:0px;border-style:none;line-height:100%;max-width:560px;outline-width:medium;outline-style:none;text-decoration:none"
                                                                                                            alt="Programmers Life Logo"
                                                                                                            width="100"
                                                                                                            height="100">
                                                                                                    </a>
                                                                                                </td>
                                                                                            </tr>
                                                                                        </tbody>
                                                                                    </table>
                                                                                </div>
                                                                            </div>
                                                                            <div>
                                                                                <div>
                                                                                    <table cellpadding="0" cellspacing="0"
                                                                                        width="100%" role="presentation"
                                                                                        style="font-family:Helvetica,Arial,serif;border-collapse:collapse;word-break:break-word">
                                                                                        <tbody>
                                                                                            <tr>
                                                                                                <td align="center"
                                                                                                    style="padding:0.625rem 0px;font-family:Helvetica,Arial,serif">
                                                                                                    <a href="https://www.facebook.com/mindh4q3rr/"
                                                                                                        style="height:32px;width:32px;display:inline-block;font-size:0px;margin:0.375rem;vertical-align:top"
                                                                                                        rel="noopener noreferrer"
                                                                                                        target="_blank">
                                                                                                        <img alt="Facebook Icon"
                                                                                                            height="32"
                                                                                                            src="https://awas.aweber-static.com/images/message-editor/social/brand/none/facebook.png"
                                                                                                            style="height:32px;width:32px;border-width:0px;border-style:none;line-height:100%;max-width:560px;outline-width:medium;outline-style:none;text-decoration:none"
                                                                                                            width="32">
                                                                                                    </a>
                                                                                                    <a href="https://twitter.com/mindh4q3rr/"
                                                                                                        style="height:32px;width:32px;display:inline-block;font-size:0px;margin:0.375rem;vertical-align:top"
                                                                                                        rel="noopener noreferrer"
                                                                                                        target="_blank">
                                                                                                        <img alt="Twitter Icon"
                                                                                                            height="32"
                                                                                                            src="https://awas.aweber-static.com/images/message-editor/social/brand/none/twitter.png"
                                                                                                            style="height:32px;width:32px;border-width:0px;border-style:none;line-height:100%;max-width:560px;outline-width:medium;outline-style:none;text-decoration:none"
                                                                                                            width="32">
                                                                                                    </a>
                                                                                                    <a href="https://www.instagram.com/mindh4q3r/"
                                                                                                        style="height:32px;width:32px;display:inline-block;font-size:0px;margin:0.375rem;vertical-align:top"
                                                                                                        rel="noopener noreferrer"
                                                                                                        target="_blank">
                                                                                                        <img alt="Instagram Icon"
                                                                                                            height="32"
                                                                                                            src="https://awas.aweber-static.com/images/message-editor/social/brand/none/instagram.png"
                                                                                                            style="height:32px;width:32px;border-width:0px;border-style:none;line-height:100%;max-width:560px;outline-width:medium;outline-style:none;text-decoration:none"
                                                                                                            width="32">
                                                                                                    </a>
                                                                                                    <a href="https://www.youtube.com/channel/UCBuiwdT12ytcmE_NMEPR-Sw?sub_confirmation=1"
                                                                                                        style="height:32px;width:32px;display:inline-block;font-size:0px;margin:0.375rem;vertical-align:top"
                                                                                                        rel="noopener noreferrer"
                                                                                                        target="_blank">
                                                                                                        <img alt="YouTube Icon"
                                                                                                            height="32"
                                                                                                            src="https://awas.aweber-static.com/images/message-editor/social/brand/none/youtube.png"
                                                                                                            style="height:32px;width:32px;border-width:0px;border-style:none;line-height:100%;max-width:560px;outline-width:medium;outline-style:none;text-decoration:none"
                                                                                                            width="32">
                                                                                                    </a>
                                                                                                    <a href="https://www.linkedin.com/in/ibrahimbs/"
                                                                                                        style="height:32px;width:32px;display:inline-block;font-size:0px;margin:0.375rem;vertical-align:top"
                                                                                                        rel="noopener noreferrer"
                                                                                                        target="_blank">
                                                                                                        <img alt="LinkedIn Icon"
                                                                                                            height="32"
                                                                                                            src="https://awas.aweber-static.com/images/message-editor/social/brand/none/linkedin.png"
                                                                                                            style="height:32px;width:32px;border-width:0px;border-style:none;line-height:100%;max-width:560px;outline-width:medium;outline-style:none;text-decoration:none"
                                                                                                            width="32">
                                                                                                    </a>
                                                                                                </td>
                                                                                            </tr>
                                                                                        </tbody>
                                                                                    </table>
                                                                                </div>
                                                                            </div>
                                                                        </td>
                                                                    </tr>
                                                                </tbody>
                                                            </table>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div style="background-color:rgb(227, 222, 222);max-width:560px;padding:0px">
                                                    <div style="margin:0px 0px 20px 0px;padding:0px;">
                                                        <div>
                                                            <div>
                                                                <table class="m_-2530275121054374444aw-stack"
                                                                    style="width:100%;font-family:Helvetica,Arial,serif;border-collapse:collapse;word-break:break-word"
                                                                    role="presentation">
                                                                    <tbody>
                                                                        <tr>
                                                                            <td class="m_-2530275121054374444container"
                                                                                style="padding:0px;width:100%;font-family:Helvetica,Arial,serif"
                                                                                width="100%" valign="top">
                                                                                <div><span>
                                                                                        <table align="center" width="100%"
                                                                                            style="float:none;text-align:center;font-family:Helvetica,Arial,serif;border-collapse:collapse;word-break:break-word"
                                                                                            role="presentation">
                                                                                            <tbody>
                                                                                                <tr>
                                                                                                    <td align="center"
                                                                                                        style="padding:0px;font-family:Helvetica,Arial,serif">
                                                                                                        <a href="https://progrmrslife.com/"
                                                                                                            target="_blank">
                                                                                                            <img src="https://hostedimages-cdn.aweber-static.com/MjEwNDg2Ng==/optimized/a7409a6802234e109d87fb072b8f8ea9.png"
                                                                                                                style="display:block;width:471px;height:315px;border-width:0px;border-style:none;line-height:100%;max-width:100%;outline-width:medium;outline-style:none;text-decoration:none;padding:0px"
                                                                                                                alt="Thanks for subscribing to our newsletter"
                                                                                                                width="471"
                                                                                                                height="315">
                                                                                                        </a>
                                                                                                    </td>
                                                                                                </tr>
                                                                                            </tbody>
                                                                                        </table>
                                                                                    </span></div>
                                                                            </td>
                                                                        </tr>
                                                                    </tbody>
                                                                </table>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div>
                                                        <div>
                                                            <div>
                                                                <table class="m_-2530275121054374444aw-stack"
                                                                    style="width:100%;font-family:Helvetica,Arial,serif;border-collapse:collapse;word-break:break-word"
                                                                    role="presentation">
                                                                    <tbody>
                                                                        <tr>
                                                                            <td class="m_-2530275121054374444container"
                                                                                style="padding:0px 0px 30px;width:100%;font-family:Helvetica,Arial,serif"
                                                                                width="100%" valign="top">
                                                                                <div>
                                                                                    <div
                                                                                        class="m_-2530275121054374444text-element m_-2530275121054374444paragraph">
                                                                                        <div
                                                                                            style="color:rgb(36,32,32);font-size:16px;font-weight:normal;line-height:1.5em;text-align:left">
                                                                                            <div
                                                                                                style="color:rgb(36,32,32);font-size:16px;font-weight:normal;line-height:1.5em;text-align:left">
                                                                                                <div
                                                                                                    style="color:rgb(36,32,32);font-size:16px;font-weight:normal;line-height:1.5em;text-align:left">
                                                                                                    <span
                                                                                                        style="color:#546a78;font-family:Tahoma,Geneva,sans-serif">Hi<i>
                                                                                                            ${firstName},
                                                                                                            👋</i></span>
                                                                                                </div>
                                                                                                <div
                                                                                                    style="color:rgb(36,32,32);font-size:16px;font-weight:normal;line-height:1.5em;text-align:left">
                                                                                                    <span
                                                                                                        style="color:#698596;font-family:Tahoma,Geneva,sans-serif">I
                                                                                                        am writing to let you
                                                                                                        know
                                                                                                        that we received your
                                                                                                        comment on our
                                                                                                        blog
                                                                                                        post,
                                                                                                        "<b><i>${postTitle}</i></b>",
                                                                                                        and it will be published
                                                                                                        very soon in our
                                                                                                    </span>
                                                                                                    <a rel="noopener noreferrer"
                                                                                                        href="https://www.progrmrslife.com/post/${slug}#allComments"
                                                                                                        style="color:rgb(64,143,231);font-weight:bold"
                                                                                                        target="_blank" n
                                                                                                        style="color:#698596;font-family:Tahoma,Geneva,sans-serif"><strong>comments
                                                                                                            section
                                                                                                            ↗.</strong></a>
                                                                                                </div>
                                                                                                <div
                                                                                                    style="color:rgb(36,32,32);font-size:16px;font-weight:normal;line-height:1.5em;text-align:left">
                                                                                                    <span
                                                                                                        style="color:#698596;font-family:Tahoma,Geneva,sans-serif">
                                                                                                        We appreciate your
                                                                                                        valuable
                                                                                                        contribution to the
                                                                                                        discussion and hope that
                                                                                                        you
                                                                                                        continue to engage with
                                                                                                        us
                                                                                                        and our community in the
                                                                                                        future. </span><br><br>
                                                                                                    <span
                                                                                                        style="color:#698596;font-family:Tahoma,Geneva,sans-serif">
                                                                                                        Your feedback and
                                                                                                        comments
                                                                                                        are important to us, and
                                                                                                        we
                                                                                                        encourage you to share
                                                                                                        your
                                                                                                        thoughts and opinions on
                                                                                                        our
                                                                                                        blog using our
                                                                                                    </span><a
                                                                                                        rel="noopener noreferrer"
                                                                                                        href="https://www.progrmrslife.com/contact-us"
                                                                                                        style="color:rgb(64,143,231);font-weight:bold"
                                                                                                        target="_blank" n
                                                                                                        style="color:#698596;font-family:Tahoma,Geneva,sans-serif"><strong>contact
                                                                                                            form ↗.</strong></a>
                                                                                                </div>
                                                                                                <div
                                                                                                    style="color:rgb(36,32,32);font-size:16px;font-weight:normal;line-height:1.5em;text-align:left">
                                                                                                    <span
                                                                                                        style="color:#698596;font-family:Tahoma,Geneva,sans-serif">We
                                                                                                        believe that
                                                                                                        constructive
                                                                                                        discussions and
                                                                                                        interactions
                                                                                                        among our readers can
                                                                                                        help
                                                                                                        create a vibrant and
                                                                                                        informative platform for
                                                                                                        sharing ideas and
                                                                                                        knowledge.
                                                                                                    </span><br><br>
                                                                                                </div>
                                                                                                <div
                                                                                                    style="color:rgb(36,32,32);font-size:16px;font-weight:normal;line-height:1.5em;text-align:left">
                                                                                                    <span
                                                                                                        style="color:#698596;font-family:Tahoma,Geneva,sans-serif">Thank
                                                                                                        you for taking the time
                                                                                                        to
                                                                                                        share your thoughts with
                                                                                                        us,
                                                                                                        and we look forward to
                                                                                                        hearing more from you in
                                                                                                        the
                                                                                                        future.</span><br><br>
                                                                                                </div>
                                                                                                <div
                                                                                                    style="color:rgb(36,32,32);font-size:16px;font-weight:normal;line-height:1.5em;text-align:left">
                                                                                                    <span
                                                                                                        style="color:#698596;font-family:Tahoma,Geneva,sans-serif">Best
                                                                                                        regards,
                                                                                                    </span><br><br>
                                                                                                </div>
                                                                                            </div>
                                                                                        </div>
                                                                                    </div>
                                                                                </div>
                                                                                <div>
                                                                                    <table align="center" border="0"
                                                                                        cellspacing="0" cellpadding="0"
                                                                                        role="presentation" width="100%"
                                                                                        style="font-family:Helvetica,Arial,serif;border-collapse:collapse;word-break:break-word;max-width:100%">
                                                                                        <tbody>
                                                                                            <tr>
                                                                                                <td
                                                                                                    style="font-family:Helvetica,Arial,serif;padding:0px 0px 30px">
                                                                                                    <table border="0"
                                                                                                        cellpadding="0"
                                                                                                        cellspacing="0"
                                                                                                        width="100%"
                                                                                                        style="font-family:Helvetica,Arial,serif;border-collapse:collapse;word-break:break-word">
                                                                                                        <tbody>
                                                                                                            <tr>
                                                                                                                <td align="left"
                                                                                                                    class="m_-2530275121054374444image"
                                                                                                                    style="font-family:Helvetica,Arial,serif;height:auto;padding:0px 15px 0px 0px;display:inline-block">
                                                                                                                    <table
                                                                                                                        align="center"
                                                                                                                        width="100%"
                                                                                                                        style="float:none;text-align:center;font-family:Helvetica,Arial,serif;border-collapse:collapse;word-break:break-word"
                                                                                                                        role="presentation">
                                                                                                                        <tbody>
                                                                                                                            <tr>
                                                                                                                                <td align="center"
                                                                                                                                    style="padding:0px 0px 12px;font-family:Helvetica,Arial,serif">
                                                                                                                                    <a href="mailto:contact@programmerslife.site"
                                                                                                                                        target="_blank">
                                                                                                                                        <img src="https://media.graphassets.com/9uVSxBP6QJ6RqcyMFRQ7"
                                                                                                                                            style="display:block;width:150px;height:150px;border-width:0px;border-style:none;line-height:100%;max-width:100%;outline-width:medium;outline-style:none;text-decoration:none"
                                                                                                                                            alt="IboTech"
                                                                                                                                            width="150"
                                                                                                                                            height="150">
                                                                                                                                    </a>
                                                                                                                                </td>
                                                                                                                            </tr>
                                                                                                                        </tbody>
                                                                                                                    </table>
                                                                                                                </td>
                                                                                                                <td class="m_-2530275121054374444paragraph"
                                                                                                                    style="font-family:Helvetica,Arial,serif;padding:0px 15px;margin:0px;display:inline-block">
                                                                                                                    <div
                                                                                                                        style="color:rgb(36,32,32);font-size:16px;font-weight:normal;line-height:1.5em;text-align:left">
                                                                                                                        <div
                                                                                                                            style="color:rgb(36,32,32);font-size:16px;font-weight:normal;line-height:1.5em;text-align:left">
                                                                                                                            <span
                                                                                                                                style="color:#698596;font-family:Tahoma,Geneva,sans-serif"><strong>Ibrahim
                                                                                                                                    BS</strong></span>
                                                                                                                        </div>
                                                                                                                    </div>
                                                                                                                    <div
                                                                                                                        style="color:rgb(36,32,32);font-size:16px;font-weight:normal;line-height:1.5em;text-align:left">
                                                                                                                        <div
                                                                                                                            style="color:rgb(36,32,32);font-size:16px;font-weight:normal;line-height:1.5em;text-align:left">
                                                                                                                            <span
                                                                                                                                style="color:#698596;font-family:Tahoma,Geneva,sans-serif">Founder
                                                                                                                                of
                                                                                                                                <i>Programmers
                                                                                                                                    Life</i></span>
                                                                                                                        </div>
                                                                                                                    </div>
                                                                                                                </td>
                                                                                                            </tr>
                                                                                                        </tbody>
                                                                                                    </table>
                                                                                                </td>
                                                                                            </tr>
                                                                                        </tbody>
                                                                                    </table>
                                                                                </div>
                                                                                <div>
                                                                                    <div>
                                                                                        <table cellpadding="0" cellspacing="0"
                                                                                            width="100%" role="presentation"
                                                                                            style="font-family:Helvetica,Arial,serif;border-collapse:collapse;word-break:break-word">
                                                                                            <tbody>
                                                                                                <tr>
                                                                                                    <td
                                                                                                        style="padding:10px 0px;font-family:Helvetica,Arial,serif">
                                                                                                        <table width="100%"
                                                                                                            role="presentation"
                                                                                                            style="border-top:1px solid rgb(255,255,255);border-collapse:collapse;font-family:Helvetica,Arial,serif;word-break:break-word">
                                                                                                            <tbody>
                                                                                                                <tr>
                                                                                                                    <td width="100%"
                                                                                                                        style="font-family:Helvetica,Arial,serif">
                                                                                                                    </td>
                                                                                                                </tr>
                                                                                                            </tbody>
                                                                                                        </table>
                                                                                                    </td>
                                                                                                </tr>
                                                                                            </tbody>
                                                                                        </table>
                                                                                    </div>
                                                                                </div>
                                                                                <div>
                                                                                    <div
                                                                                        class="m_-2530275121054374444text-element m_-2530275121054374444paragraph">
                                                                                        <div
                                                                                            style="color:rgb(36,32,32);font-size:16px;font-weight:normal;line-height:1.5em;text-align:left">
                                                                                            <p
                                                                                                style="color:rgb(36,32,32);font-size:16px;font-weight:normal;line-height:1.5em;text-align:left">
                                                                                                <span
                                                                                                    style="color:#698596">Discover
                                                                                                    the
                                                                                                    Latest Gems: Check Out Our
                                                                                                    <i><strong>Newest
                                                                                                            Articles</strong></i>!
                                                                                                    📰</span>
                                                                                            </p>
                                                                                        </div>
                                                                                    </div>
                                                                                </div>
                                                                                <div>
                                                                                    <div>
                                                                                        <table cellpadding="0" cellspacing="0"
                                                                                            width="100%" role="presentation"
                                                                                            style="font-family:Helvetica,Arial,serif;word-break:break-word">
                                                                                            <tbody>
                                                                                                <tr>
                                                                                                    <td
                                                                                                        style="padding:10px 0px;font-family:Helvetica,Arial,serif">
                                                                                                        <table width="100%"
                                                                                                            role="presentation"
                                                                                                            style="border-top:1px solid rgb(255,255,255);border-collapse:collapse;font-family:Helvetica,Arial,serif;word-break:break-word">
                                                                                                            <tbody>
                                                                                                                <tr>
                                                                                                                    <td width="100%"
                                                                                                                        style="font-family:Helvetica,Arial,serif">
                                                                                                                    </td>
                                                                                                                </tr>
                                                                                                            </tbody>
                                                                                                        </table>
                                                                                                    </td>
                                                                                                </tr>
                                                                                            </tbody>
                                                                                        </table>
                                                                                    </div>
                                                                                </div>
                                                                            </td>
                                                                        </tr>
                                                                    </tbody>
                                                                </table>
                                                                <table class="m_-2530275121054374444aw-stack"
                                                                    style="width:100%;font-family:Helvetica,Arial,serif;word-break:break-word"
                                                                    role="presentation">
                                                                    <tbody>
                                                                        <tr>
                                                                            <td class="m_-2530275121054374444container"
                                                                                style="padding:0px;width:31.4%;font-family:Helvetica,Arial,serif"
                                                                                width="31.4%" valign="top">
                                                                                <div><span>
                                                                                        <table align="center" width="100%"
                                                                                            style="float:none;text-align:center;font-family:Helvetica,Arial,serif;border-collapse:collapse;word-break:break-word"
                                                                                            role="presentation">
                                                                                            <tbody>
                                                                                                <tr>
                                                                                                    <td align="center"
                                                                                                        style="padding:0px;font-family:Helvetica,Arial,serif">
                                                                                                        <a href="https://www.progrmrslife.com/post/remote-job-websites"
                                                                                                            target="_blank">
                                                                                                            <img src="https://media.graphassets.com/LWta5xL7TxeJVuIpwofA"
                                                                                                                style="display:block;width:175px;height:96px;border-width:0px;border-style:none;line-height:100%;max-width:100%;outline-width:medium;outline-style:none;text-decoration:none"
                                                                                                                alt="14 Websites Paying USD Salaries for Remote Jobs: Your Guide to Finding the Perfect Remote Work Opportunity"
                                                                                                                width="175"
                                                                                                                height="96">
                                                                                                        </a>
                                                                                                    </td>
                                                                                                </tr>
                                                                                            </tbody>
                                                                                        </table>
                                                                                    </span></div>
                                                                            </td>
                                                                            <td class="m_-2530275121054374444container"
                                                                                style="padding:0px 30px 10px;width:68.6%;font-family:Helvetica,Arial,serif"
                                                                                width="68.6%" valign="top">
                                                                                <div>
                                                                                    <div
                                                                                        class="m_-2530275121054374444text-element m_-2530275121054374444paragraph">
                                                                                        <div
                                                                                            style="color:rgb(36,32,32);font-size:16px;font-weight:normal;line-height:1.5em;text-align:left">
                                                                                            <p
                                                                                                style="text-align:left;color:rgb(36,32,32);font-size:16px;font-weight:normal;line-height:1.5em">
                                                                                                <span
                                                                                                    style="font-size:14px"><strong>14
                                                                                                        Websites Paying USD
                                                                                                        Salaries
                                                                                                        for Remote Jobs: Your
                                                                                                        Guide
                                                                                                        to Finding the Perfect
                                                                                                        Remote Work
                                                                                                        Opportunity</strong></span>
                                                                                            </p>
                                                                                        </div>
                                                                                    </div>
                                                                                </div>
                                                                                <div>
                                                                                    <div
                                                                                        class="m_-2530275121054374444text-element m_-2530275121054374444paragraph">
                                                                                        <div
                                                                                            style="color:rgb(36,32,32);font-size:16px;font-weight:normal;line-height:1.5em;text-align:left">
                                                                                            <p
                                                                                                style="text-align:left;color:rgb(36,32,32);font-size:16px;font-weight:normal;line-height:1.5em">
                                                                                                <span
                                                                                                    style="color:rgb(55,65,81);font-size:14px"><span
                                                                                                        style="display:inline!important;float:none;font-style:normal;font-variant-caps:normal;font-variant-ligatures:normal;font-weight:400;letter-spacing:normal;text-align:center;text-decoration-color:initial;text-decoration-style:initial;text-indent:0px;text-transform:none;white-space:normal;word-spacing:0px">Discover
                                                                                                        your path to remote work
                                                                                                        success with our
                                                                                                        comprehensive guide to
                                                                                                        14
                                                                                                        websites that pay USD
                                                                                                        salaries for remote
                                                                                                        jobs.
                                                                                                        From connecting with
                                                                                                        thousands of remote
                                                                                                        workers
                                                                                                        to accessing curated job
                                                                                                        listings and expert
                                                                                                        advice,
                                                                                                        these platforms offer
                                                                                                        the
                                                                                                        perfect opportunities
                                                                                                        for
                                                                                                        finding your dream
                                                                                                        remote
                                                                                                        job. Whether you're a
                                                                                                        digital nomad, a parent
                                                                                                        seeking work-life
                                                                                                        balance,
                                                                                                        or simply crave the
                                                                                                        freedom
                                                                                                        of remote work, this
                                                                                                        article
                                                                                                        has everything you need
                                                                                                        to
                                                                                                        kickstart your remote
                                                                                                        career. Explore the top
                                                                                                        websites in the remote
                                                                                                        job
                                                                                                        market and unlock the
                                                                                                        doors
                                                                                                        to a flexible and
                                                                                                        fulfilling
                                                                                                        work-life experience.
                                                                                                        👉</span></span>
                                                                                            </p>
                                                                                            <p
                                                                                                style="text-align:left;color:rgb(36,32,32);font-size:16px;font-weight:normal;line-height:1.5em">
                                                                                                <a rel="noopener noreferrer"
                                                                                                    href="https://www.progrmrslife.com/post/remote-job-websites"
                                                                                                    style="color:rgb(64,143,231);font-weight:bold"
                                                                                                    target="_blank"
                                                                                                    style="color:#6b71e0;font-size:14px">Continue
                                                                                                    reading
                                                                                                    </span></a><span
                                                                                                    style="color:#6b71e0;font-size:14px">↗</span>
                                                                                            </p>
                                                                                        </div>
                                                                                    </div>
                                                                                </div>
                                                                                <div>
                                                                                    <div>
                                                                                        <table cellpadding="0" cellspacing="0"
                                                                                            width="100%" role="presentation"
                                                                                            style="font-family:Helvetica,Arial,serif;border-collapse:collapse;word-break:break-word">
                                                                                            <tbody>
                                                                                                <tr>
                                                                                                    <td
                                                                                                        style="padding:10px 0px;font-family:Helvetica,Arial,serif">
                                                                                                        <table width="100%"
                                                                                                            role="presentation"
                                                                                                            style="border-top:1px solid rgb(222,224,232);border-collapse:collapse;font-family:Helvetica,Arial,serif;word-break:break-word">
                                                                                                            <tbody>
                                                                                                                <tr>
                                                                                                                    <td width="100%"
                                                                                                                        style="font-family:Helvetica,Arial,serif">
                                                                                                                    </td>
                                                                                                                </tr>
                                                                                                            </tbody>
                                                                                                        </table>
                                                                                                    </td>
                                                                                                </tr>
                                                                                            </tbody>
                                                                                        </table>
                                                                                    </div>
                                                                                </div>
                                                                            </td>
                                                                        </tr>
                                                                    </tbody>
                                                                </table>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div style="max-width:560px">
                                                    <div>
                                                        <div>
                                                            <table class="m_-2530275121054374444aw-stack"
                                                                style="width:100%;font-family:Helvetica,Arial,serif;border-collapse:collapse;word-break:break-word"
                                                                role="presentation">
                                                                <tbody>
                                                                    <tr>
                                                                        <td class="m_-2530275121054374444container"
                                                                            style="padding:0px;width:31.4%;font-family:Helvetica,Arial,serif"
                                                                            width="31.4%" valign="top">
                                                                            <div><span>
                                                                                    <table align="center" width="100%"
                                                                                        style="float:none;text-align:center;font-family:Helvetica,Arial,serif;border-collapse:collapse;word-break:break-word"
                                                                                        role="presentation">
                                                                                        <tbody>
                                                                                            <tr>
                                                                                                <td align="center"
                                                                                                    style="padding:0px;font-family:Helvetica,Arial,serif">
                                                                                                    <a href="https://www.progrmrslife.com/post/linkedin-learning-free-trials"
                                                                                                        target="_blank">
                                                                                                        <img src="https://media.graphassets.com/tYqoqrdkQoCBVn04GW4U"
                                                                                                            style="display:block;width:175px;height:98px;border-width:0px;border-style:none;line-height:100%;max-width:560px;outline-width:medium;outline-style:none;text-decoration:none"
                                                                                                            alt="LinkedIn Learning Premium: Ignite Your Professional Growth with Free Trials and Unlimited Courses"
                                                                                                            width="175"
                                                                                                            height="98">
                                                                                                    </a>
                                                                                                </td>
                                                                                            </tr>
                                                                                        </tbody>
                                                                                    </table>
                                                                                </span></div>
                                                                        </td>
                                                                        <td class="m_-2530275121054374444container"
                                                                            style="padding:0px 30px;width:68.6%;font-family:Helvetica,Arial,serif"
                                                                            width="68.6%" valign="top">
                                                                            <div>
                                                                                <div
                                                                                    class="m_-2530275121054374444text-element m_-2530275121054374444paragraph">
                                                                                    <div
                                                                                        style="color:rgb(36,32,32);font-size:16px;font-weight:normal;line-height:1.6em;text-align:center">
                                                                                        <p
                                                                                            style="text-align:left;color:rgb(36,32,32);font-size:16px;font-weight:normal;line-height:1.6em">
                                                                                            <span
                                                                                                style="font-size:14px"><strong>LinkedIn
                                                                                                    Learning Premium: Ignite
                                                                                                    Your
                                                                                                    Professional Growth with
                                                                                                    Free
                                                                                                    Trials and Unlimited
                                                                                                    Courses</strong></span>
                                                                                        </p>
                                                                                    </div>
                                                                                </div>
                                                                            </div>
                                                                            <div>
                                                                                <div
                                                                                    class="m_-2530275121054374444text-element m_-2530275121054374444paragraph">
                                                                                    <div
                                                                                        style="color:rgb(36,32,32);font-size:16px;font-weight:normal;line-height:1.6em;text-align:center">
                                                                                        <p
                                                                                            style="text-align:left;color:rgb(36,32,32);font-size:16px;font-weight:normal;line-height:1.6em">
                                                                                            <span
                                                                                                style="color:rgb(55,65,81);font-size:14px">Discover
                                                                                                the power of LinkedIn Learning
                                                                                                Premium and unlock your
                                                                                                professional
                                                                                                growth! With free trials and
                                                                                                unlimited access to a vast
                                                                                                library
                                                                                                of courses, you can ignite your
                                                                                                learning journey, enhance your
                                                                                                skills, and propel your career
                                                                                                forward. Dive into the world of
                                                                                                in-demand training courses and
                                                                                                certifications, and embrace the
                                                                                                opportunity to expand your
                                                                                                knowledge
                                                                                                with industry experts. Don't
                                                                                                miss
                                                                                                out on this game-changing
                                                                                                opportunity - start your
                                                                                                LinkedIn
                                                                                                Learning Premium experience
                                                                                                today!</span>
                                                                                        </p>
                                                                                        <p
                                                                                            style="text-align:left;color:rgb(36,32,32);font-size:16px;font-weight:normal;line-height:1.6em">
                                                                                            <a rel="noopener noreferrer"
                                                                                                href="https://www.progrmrslife.com/post/linkedin-learning-free-trials"
                                                                                                style="color:rgb(64,143,231);font-weight:bold"
                                                                                                target="_blank" n
                                                                                                style="color:#6b71e0;font-size:14px">Continue
                                                                                                reading </span></a><span
                                                                                                style="color:#6b71e0;font-size:14px">↗</span>
                                                                                        </p>
                                                                                    </div>
                                                                                </div>
                                                                            </div>
                                                                            <div>
                                                                                <div>
                                                                                    <table cellpadding="0" cellspacing="0"
                                                                                        width="100%" role="presentation"
                                                                                        style="font-family:Helvetica,Arial,serif;border-collapse:collapse;word-break:break-word">
                                                                                        <tbody>
                                                                                            <tr>
                                                                                                <td
                                                                                                    style="padding:10px 0px;font-family:Helvetica,Arial,serif">
                                                                                                    <table width="100%"
                                                                                                        role="presentation"
                                                                                                        style="border-top:1px solid rgb(222,224,232);border-collapse:collapse;font-family:Helvetica,Arial,serif;word-break:break-word">
                                                                                                        <tbody>
                                                                                                            <tr>
                                                                                                                <td width="100%"
                                                                                                                    style="font-family:Helvetica,Arial,serif">
                                                                                                                </td>
                                                                                                            </tr>
                                                                                                        </tbody>
                                                                                                    </table>
                                                                                                </td>
                                                                                            </tr>
                                                                                        </tbody>
                                                                                    </table>
                                                                                </div>
                                                                            </div>
                                                                        </td>
                                                                    </tr>
                                                                </tbody>
                                                            </table>
                                                            <table class="m_-2530275121054374444aw-stack"
                                                                style="width:100%;font-family:Helvetica,Arial,serif;word-break:break-word"
                                                                role="presentation">
                                                                <tbody>
                                                                    <tr>
                                                                        <td class="m_-2530275121054374444container"
                                                                            style="padding:0px;width:31.4%;font-family:Helvetica,Arial,serif"
                                                                            width="31.4%" valign="top">
                                                                            <div><span>
                                                                                    <table align="center" width="100%"
                                                                                        style="float:none;text-align:center;font-family:Helvetica,Arial,serif;border-collapse:collapse;word-break:break-word"
                                                                                        role="presentation">
                                                                                        <tbody>
                                                                                            <tr>
                                                                                                <td align="center"
                                                                                                    style="padding:0px;font-family:Helvetica,Arial,serif">
                                                                                                    <a href="https://www.progrmrslife.com/post/chatgpt-plus-for-free"
                                                                                                        target="_blank">
                                                                                                        <img src="https://media.graphassets.com/bb57BP3TlGhPNGLtWSqv"
                                                                                                            style="display:block;width:175px;height:96px;border-width:0px;border-style:none;line-height:100%;max-width:560px;outline-width:medium;outline-style:none;text-decoration:none"
                                                                                                            alt="ChatGPT: A Comprehensive Guide and ChatGPT Plus Review – Unleashing Its Power"
                                                                                                            width="175"
                                                                                                            height="96">
                                                                                                    </a>
                                                                                                </td>
                                                                                            </tr>
                                                                                        </tbody>
                                                                                    </table>
                                                                                </span></div>
                                                                        </td>
                                                                        <td class="m_-2530275121054374444container"
                                                                            style="padding:0px 30px;width:68.6%;font-family:Helvetica,Arial,serif"
                                                                            width="68.6%" valign="top">
                                                                            <div>
                                                                                <div
                                                                                    class="m_-2530275121054374444text-element m_-2530275121054374444paragraph">
                                                                                    <div
                                                                                        style="color:rgb(36,32,32);font-size:16px;font-weight:normal;line-height:1.6em;text-align:center">
                                                                                        <p
                                                                                            style="text-align:left;color:rgb(36,32,32);font-size:16px;font-weight:normal;line-height:1.6em">
                                                                                            <span
                                                                                                style="font-size:14px"><strong>ChatGPT:
                                                                                                    A Comprehensive Guide and
                                                                                                    ChatGPT Plus Review –
                                                                                                    Unleashing
                                                                                                    Its Power</strong></span>
                                                                                        </p>
                                                                                    </div>
                                                                                </div>
                                                                            </div>
                                                                            <div>
                                                                                <div
                                                                                    class="m_-2530275121054374444text-element m_-2530275121054374444paragraph">
                                                                                    <div
                                                                                        style="color:rgb(36,32,32);font-size:16px;font-weight:normal;line-height:1.6em;text-align:center">
                                                                                        <p
                                                                                            style="text-align:left;color:rgb(36,32,32);font-size:16px;font-weight:normal;line-height:1.6em">
                                                                                            <span
                                                                                                style="color:rgb(55,65,81);font-size:14px">Curious
                                                                                                about the future of AI-powered
                                                                                                conversations? Discover the
                                                                                                marvels
                                                                                                of ChatGPT – a language model
                                                                                                transforming communication as we
                                                                                                know it. Delve into its
                                                                                                evolution,
                                                                                                remarkable capabilities, and the
                                                                                                crucial ethical considerations
                                                                                                it
                                                                                                raises. Immerse yourself in a
                                                                                                world
                                                                                                of lifelike chatting
                                                                                                experiences.
                                                                                                And don't miss our comprehensive
                                                                                                guide, where we unravel the
                                                                                                fascinating ChatGPT Plus
                                                                                                subscription plan, providing a
                                                                                                glimpse into the exciting
                                                                                                horizon of
                                                                                                AI-driven interaction.</span>
                                                                                        </p>
                                                                                        <p
                                                                                            style="text-align:left;color:rgb(36,32,32);font-size:16px;font-weight:normal;line-height:1.6em">
                                                                                            <a rel="noopener noreferrer"
                                                                                                href="https://www.progrmrslife.com/post/chatgpt-plus-for-free"
                                                                                                style="color:rgb(64,143,231);font-weight:bold"
                                                                                                target="_blank">
                                                                                                <span
                                                                                                    style="color:#6b71e0;font-size:14px">Continue
                                                                                                    reading </span></a><span
                                                                                                style="color:#6b71e0;font-size:14px">↗</span>
                                                                                        </p>
                                                                                    </div>
                                                                                </div>
                                                                            </div>
                                                                            <div>
                                                                                <div>
                                                                                    <table cellpadding="0" cellspacing="0"
                                                                                        width="100%" role="presentation"
                                                                                        style="font-family:Helvetica,Arial,serif;border-collapse:collapse;word-break:break-word">
                                                                                        <tbody>
                                                                                            <tr>
                                                                                                <td
                                                                                                    style="padding:10px 0px;font-family:Helvetica,Arial,serif">
                                                                                                    <table width="100%"
                                                                                                        role="presentation"
                                                                                                        style="border-top:1px solid rgb(222,224,232);border-collapse:collapse;font-family:Helvetica,Arial,serif;word-break:break-word">
                                                                                                        <tbody>
                                                                                                            <tr>
                                                                                                                <td width="100%"
                                                                                                                    style="font-family:Helvetica,Arial,serif">
                                                                                                                </td>
                                                                                                            </tr>
                                                                                                        </tbody>
                                                                                                    </table>
                                                                                                </td>
                                                                                            </tr>
                                                                                        </tbody>
                                                                                    </table>
                                                                                </div>
                                                                            </div>
                                                                        </td>
                                                                    </tr>
                                                                </tbody>
                                                            </table>
                                                            <table class="m_-2530275121054374444aw-stack"
                                                                style="width:100%;font-family:Helvetica,Arial,serif;word-break:break-word"
                                                                role="presentation">
                                                                <tbody>
                                                                    <tr>
                                                                        <td class="m_-2530275121054374444container"
                                                                            style="padding:0px;width:100%;font-family:Helvetica,Arial,serif"
                                                                            width="100%" valign="top">
                                                                            <div>
                                                                                <div>
                                                                                    <table cellpadding="0" cellspacing="0"
                                                                                        width="100%" role="presentation"
                                                                                        style="font-family:Helvetica,Arial,serif;border-collapse:collapse;word-break:break-word">
                                                                                        <tbody>
                                                                                            <tr>
                                                                                                <td
                                                                                                    style="padding:20px 0px 10px;font-family:Helvetica,Arial,serif">
                                                                                                    <table width="100%"
                                                                                                        role="presentation"
                                                                                                        style="border-top:1px solid rgb(222,224,232);border-collapse:collapse;font-family:Helvetica,Arial,serif;word-break:break-word">
                                                                                                        <tbody>
                                                                                                            <tr>
                                                                                                                <td width="100%"
                                                                                                                    style="font-family:Helvetica,Arial,serif">
                                                                                                                </td>
                                                                                                            </tr>
                                                                                                        </tbody>
                                                                                                    </table>
                                                                                                </td>
                                                                                            </tr>
                                                                                        </tbody>
                                                                                    </table>
                                                                                </div>
                                                                            </div>
                                                                        </td>
                                                                    </tr>
                                                                </tbody>
                                                            </table>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </center>
                    <div align="center" id="m_-2530275121054374444aweber_container" style="width:100%!important">
                        <div id="m_-2530275121054374444aweber_rem"
                            style="box-sizing:border-box;color:#000000!important;font-family:Helvetica,Arial,sans-serif!important;font-size:12px!important;line-height:16px;margin:0px;max-width:600px;padding:0px 8px;width:100%">
                            <div style="text-align:center"><span style="color:#000000!important">Programmers Life<br>
                                    M: +21652777039<br>
                                    E: contact@programmerslife.site<br>
                                    A: 47 Saada ST, Nabeul<br>
                                    🌐 www.progrmrslife.com<br><br>47 Saada ST, Nabeul<br>
                                    Tunis Tunis 8080<br>
                                    TUNISIA</span><br><br>
                            </div>
                        </div>
                    </div>
                </div>
            </body>
            `,
            };

            await transporter.sendMail(mailOptions);

            res.status(200).json({ message: "Email sent successfully!" });
            } catch (error) {
                console.error(error);
                
                res.status(500).json({ message: "Error sending email." });
        }
    });
};

export default handler;