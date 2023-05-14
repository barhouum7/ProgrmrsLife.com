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
      user: process.env.SENDER_EMAIL_ADDRESS,
      pass: process.env.SENDER_EMAIL_PASS,
    },
  });

const handler = (req, res) => {
  // Run the cors middleware
    cors(req, res, async () => {
        try {
            const { name, email, postTitle, slug } = req.body;
            const shortedPostTitle = postTitle.substring(0, 20);
            // Get the recipient email address from request body
            const toEmail = email;

            const mailOptions = {
            from: process.env.EMAIL_ADDRESS,
            to: toEmail,
            subject: `Your Comment on (${shortedPostTitle}...) Has Been Published!👏🥳`,
            html: `
            <!doctypehtml>
            <html lang=en>
            <meta content="text/html; charset=UTF-8" http-equiv=Content-Type>
            <style>
                a,
                body,
                div,
                input,
                p,
                td {
                    font-family: arial, sans-serif
                }
            </style>
            <meta content="IE=edge" http-equiv=X-UA-Compatible>
            <meta content="width=device-width,initial-scale=1,minimum-scale=1" name=viewport>
            <title>Your Comment on (${shortedPostTitle}...) Has Been Published!👏🥳</title>
            <style>
                body,
                td {
                    font-size: 13px
                }
        
                a:active,
                a:link {
                    color: #15c;
                    text-decoration: none
                }
        
                a:hover {
                    text-decoration: underline;
                    cursor: pointer
                }
        
                a:visited {
                    color: #61c
                }
        
                img {
                    border: 0
                }
        
                pre {
                    white-space: pre;
                    white-space: -moz-pre-wrap;
                    white-space: -o-pre-wrap;
                    white-space: pre-wrap;
                    word-wrap: break-word;
                    max-width: 800px;
                    overflow: auto
                }
        
                .logo {
                    left: -7px;
                    position: relative
                }
            </style>
        
            <body align=center>
                <div class=bodycontainer align=center>
                    <table width=100% cellpadding=12 cellspacing=0 border=0
                        style=background-color:#9095e7;font-family:Helvetica,Arial,serif;border-collapse:collapse>
                        <tr>
                            <td>
                                <div style=overflow:hidden>
                                    <div>
                                        <div>
                                            <div
                                                style=display:none;font-size:1px;background:#fff;background-color:#fff;color:#000;line-height:1px;max-height:0;max-width:0;opacity:0;overflow:hidden>
                                                Programmers Life is a community dedicated to helping IT
                                                professionals and enthusiasts by providing free resources, tools,
                                                and expert tips to help them succeed in their careers and stay
                                                up-to-date with</div>
                                        </div>
                                        <div align=center>
                                            <div align=center>
                                                <table role=presentation width=100% align=center border=0 cellpadding=0
                                                    cellspacing=0>
                                                    <tr>
                                                        <td
                                                            style=font-family:Helvetica,Arial,sans-serif;margin-bottom:30px;padding:0;text-align:left>
                                                            <div align=center>
                                                                <div style=max-width:560px>
                                                                    <div>
                                                                        <div>
                                                                            <table role=presentation
                                                                                style=width:100%;font-family:Helvetica,Arial,serif;border-collapse:collapse
                                                                                class=m_-9118421173644749603aw-stack>
                                                                                <tr>
                                                                                    <td style="padding:30px 0 0;width:100%;font-family:Helvetica,Arial,serif"
                                                                                        width=100%
                                                                                        class=m_-9118421173644749603container
                                                                                        valign=top>
                                                                            </table>
                                                                            <table role=presentation
                                                                                style=width:100%;font-family:Helvetica,Arial,serif;border-collapse:collapse
                                                                                class=m_-9118421173644749603aw-stack>
                                                                                <tr>
                                                                                    <td style=padding:20px;width:1.8%;font-family:Helvetica,Arial,serif
                                                                                        width=1.8%
                                                                                        class=m_-9118421173644749603container
                                                                                        valign=middle bgcolor=#FFFFFF>
                                                                                        <div>
                                                                                            <div>
                                                                                                <table role=presentation
                                                                                                    style=float:none;text-align:left;font-family:Helvetica,Arial,serif;border-collapse:collapse
                                                                                                    width=100% align=left>
                                                                                                    <tr>
                                                                                                        <td style=padding:0;font-family:Helvetica,Arial,serif
                                                                                                            align=left>
                                                                                                            <img height=50
                                                                                                                src="https://ci4.googleusercontent.com/proxy/2APSaSxBYpAEhncvaBJeh1Ael19XvmgYtXgyyH5xTvqEXWMctHCWNVRkDGivr016i0FhVPa1x1Tc2ouI8ygkPeFPqZ24lYPBgtGS4PAS9sxX2T9VjuuEIbKw3v-7aJqtj7HFZHDcJ7aEJKCehpYfzcfenRHGCHrS0BLj3j5_EZ9wWRWnfw=s0-d-e1-ft#https://hostedimages-cdn.aweber-static.com/MjEwNDg2Ng==/original/0445d8c9b9ce44078aaf0754158c337e.png?t=1684014518"
                                                                                                                style=display:block;width:50px;height:50px;border-width:0;border-style:none;line-height:100%;max-width:560px;outline-width:medium;outline-style:none;text-decoration:none
                                                                                                                width=50 alt="">
                                                                                                </table>
                                                                                            </div>
                                                                                        </div>
                                                                                    <td style=padding:20px;width:98.2%;font-family:Helvetica,Arial,serif
                                                                                        width=98.2%
                                                                                        class=m_-9118421173644749603container
                                                                                        valign=middle bgcolor=#FFFFFF>
                                                                                        <div>
                                                                                            <div
                                                                                                class="m_-9118421173644749603paragraph m_-9118421173644749603text-element">
                                                                                                <div
                                                                                                    style=color:#242020;font-size:18px;font-weight:400;line-height:1.5em;text-align:left>
                                                                                                    <p
                                                                                                        style=text-align:center;color:#242020;font-size:18px;font-weight:400;line-height:1.5em>
                                                                                                        <span
                                                                                                            style=font-size:14px>Programmers
                                                                                                            Life is
                                                                                                            a
                                                                                                            community
                                                                                                            dedicated
                                                                                                            to
                                                                                                            helping
                                                                                                            IT
                                                                                                            professionals
                                                                                                            and
                                                                                                            enthusiasts
                                                                                                            by
                                                                                                            providing
                                                                                                            free
                                                                                                            resources,
                                                                                                            tools,
                                                                                                            and
                                                                                                            expert
                                                                                                            tips to
                                                                                                            help
                                                                                                            them
                                                                                                            succeed
                                                                                                            in their
                                                                                                            careers
                                                                                                            and stay
                                                                                                            up-to-date
                                                                                                            with the
                                                                                                            latest
                                                                                                            industry
                                                                                                            trends.</span>
                                                                                                </div>
                                                                                            </div>
                                                                                        </div>
                                                                            </table>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                                <div style=background-color:#fff;max-width:560px;padding:0>
                                                                    <div style=margin:0;padding:0>
                                                                        <div>
                                                                            <div>
                                                                                <table role=presentation
                                                                                    style=width:100%;font-family:Helvetica,Arial,serif;border-collapse:collapse
                                                                                    class=m_-9118421173644749603aw-stack>
                                                                                    <tr>
                                                                                        <td style=padding:0;width:100%;font-family:Helvetica,Arial,serif
                                                                                            width=100%
                                                                                            class=m_-9118421173644749603container
                                                                                            valign=top>
                                                                                            <div><span>
                                                                                                    <table role=presentation
                                                                                                        style=float:none;text-align:center;font-family:Helvetica,Arial,serif;border-collapse:collapse
                                                                                                        width=100% align=center>
                                                                                                        <tr>
                                                                                                            <td style=padding:0;font-family:Helvetica,Arial,serif
                                                                                                                align=center>
                                                                                                                <a href=https://programmerslife.site/
                                                                                                                    target=_blank><img
                                                                                                                        height=315
                                                                                                                        src="https://ci4.googleusercontent.com/proxy/QWjKAdV-kvMfB4U0RznH8OaRVWjZlFcyT6TMmREmjs_wJwO_qUlTB2sTM8OmVs-mBWtr2bePkaGo1f6gKMmvIsl7ivimNkzbrZ7tq8rt91szySj4RSpToLCijSF_2qWdhH-kma86Db_oCcCSofNlId5GMFrM-oXGhP5MWQWCLmhfDP1pgZQ=s0-d-e1-ft#https://hostedimages-cdn.aweber-static.com/MjEwNDg2Ng==/optimized/a7409a6802234e109d87fb072b8f8ea9.png?t=1684014518"
                                                                                                                        style=display:block;width:560px;height:315px;border-width:0;border-style:none;line-height:100%;max-width:100%;outline-width:medium;outline-style:none;text-decoration:none;padding:0
                                                                                                                        width=560
                                                                                                                        alt=""></a>
                                                                                                    </table>
                                                                                                </span></div>
                                                                                </table>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                    <div>
                                                                        <div>
                                                                            <div>
                                                                                <table role=presentation
                                                                                    style=width:100%;font-family:Helvetica,Arial,serif;border-collapse:collapse
                                                                                    class=m_-9118421173644749603aw-stack>
                                                                                    <tr>
                                                                                        <td style="padding:30px 30px 10px;width:100%;font-family:Helvetica,Arial,serif"
                                                                                            width=100%
                                                                                            class=m_-9118421173644749603container
                                                                                            valign=top>
                                                                                            <div>
                                                                                                <div
                                                                                                    class="m_-9118421173644749603paragraph m_-9118421173644749603text-element">
                                                                                                    <div
                                                                                                        style=color:#242020;font-size:18px;font-weight:400;line-height:1.5em;text-align:left>
                                                                                                        <p
                                                                                                            style=color:#242020;font-size:18px;font-weight:400;line-height:1.5em;text-align:left>
                                                                                                            <br>Dear
                                                                                                            ${name},
                                                                                                        <p
                                                                                                            style=color:#242020;font-size:18px;font-weight:400;line-height:1.5em;text-align:left>
                                                                                                            <br><span
                                                                                                                style=background-color:#fff;color:#222;font-family:Tahoma,Geneva,sans-serif><span
                                                                                                                    style=display:inline!important;float:none;font-style:normal;font-variant-caps:normal;font-variant-ligatures:normal;font-weight:400;letter-spacing:normal;text-align:start;text-decoration-color:initial;text-decoration-style:initial;text-indent:0;text-transform:none;white-space:normal;word-spacing:0>I
                                                                                                                    am
                                                                                                                    writing
                                                                                                                    to
                                                                                                                    let
                                                                                                                    you
                                                                                                                    know
                                                                                                                    that
                                                                                                                    your
                                                                                                                    comment
                                                                                                                    on
                                                                                                                    our
                                                                                                                    blog
                                                                                                                    post,
                                                                                                                    "${postTitle}",
                                                                                                                    has
                                                                                                                    been
                                                                                                                    published
                                                                                                                    in
                                                                                                                    our
                                                                                                                </span></span><a
                                                                                                                href=https://www.programmerslife.site/post/${slug}#allComments
                                                                                                                target=_blank
                                                                                                                rel="noopener
        noreferrer" style=background-color:#fff;color:#15c;font-family:Tahoma,Geneva,sans-serif;font-style:normal;font-variant-caps:normal;font-variant-ligatures:normal;font-weight:400;letter-spacing:normal;text-align:start;text-indent:0;text-transform:none;white-space:normal;word-spacing:0>website's
                                                                                                                comments
                                                                                                                section</a><span
                                                                                                                style=background-color:#fff;color:#222;font-family:Tahoma,Geneva,sans-serif><span
                                                                                                                    style=display:inline!important;float:none;font-style:normal;font-variant-caps:normal;font-variant-ligatures:normal;font-weight:400;letter-spacing:normal;text-align:start;text-decoration-color:initial;text-decoration-style:initial;text-indent:0;text-transform:none;white-space:normal;word-spacing:0>.
                                                                                                                    We
                                                                                                                    appreciate
                                                                                                                    your
                                                                                                                    valuable
                                                                                                                    contribution
                                                                                                                    to
                                                                                                                    the
                                                                                                                    discussion
                                                                                                                    and
                                                                                                                    hope
                                                                                                                    that
                                                                                                                    you
                                                                                                                    continue
                                                                                                                    to
                                                                                                                    engage
                                                                                                                    with
                                                                                                                    us
                                                                                                                    and
                                                                                                                    our
                                                                                                                    community
                                                                                                                    in
                                                                                                                    the
                                                                                                                    future.</span></span><br><br><span
                                                                                                                style=background-color:#fff;color:#222;font-family:Tahoma,Geneva,sans-serif><span
                                                                                                                    style=display:inline!important;float:none;font-style:normal;font-variant-caps:normal;font-variant-ligatures:normal;font-weight:400;letter-spacing:normal;text-align:start;text-decoration-color:initial;text-decoration-style:initial;text-indent:0;text-transform:none;white-space:normal;word-spacing:0>Your
                                                                                                                    feedback
                                                                                                                    and
                                                                                                                    comments
                                                                                                                    are
                                                                                                                    important
                                                                                                                    to
                                                                                                                    us,
                                                                                                                    and
                                                                                                                    we
                                                                                                                    encourage
                                                                                                                    you
                                                                                                                    to
                                                                                                                    share
                                                                                                                    your
                                                                                                                    thoughts
                                                                                                                    and
                                                                                                                    opinions
                                                                                                                    on
                                                                                                                    our
                                                                                                                    blog
                                                                                                                    using
                                                                                                                    our
                                                                                                                </span></span><a
                                                                                                                href=https://www.programmerslife.site/ContactUs
                                                                                                                target=_blank
                                                                                                                rel="noopener noreferrer"
                                                                                                                style=background-color:#fff;color:#15c;font-family:Tahoma,Geneva,sans-serif;font-style:normal;font-variant-caps:normal;font-variant-ligatures:normal;font-weight:400;letter-spacing:normal;text-align:start;text-indent:0;text-transform:none;white-space:normal;word-spacing:0>contact
                                                                                                                form</a><span
                                                                                                                style=background-color:#fff;color:#222;font-family:Tahoma,Geneva,sans-serif><span
                                                                                                                    style=display:inline!important;float:none;font-style:normal;font-variant-caps:normal;font-variant-ligatures:normal;font-weight:400;letter-spacing:normal;text-align:start;text-decoration-color:initial;text-decoration-style:initial;text-indent:0;text-transform:none;white-space:normal;word-spacing:0>.
                                                                                                                    We
                                                                                                                    believe
                                                                                                                    that
                                                                                                                    constructive
                                                                                                                    discussions
                                                                                                                    and
                                                                                                                    interactions
                                                                                                                    among
                                                                                                                    our
                                                                                                                    readers
                                                                                                                    can
                                                                                                                    help
                                                                                                                    create
                                                                                                                    a
                                                                                                                    vibrant
                                                                                                                    and
                                                                                                                    informative
                                                                                                                    platform
                                                                                                                    for
                                                                                                                    sharing
                                                                                                                    ideas
                                                                                                                    and
                                                                                                                    knowledge.</span></span><br><br><span
                                                                                                                style=background-color:#fff;color:#222;font-family:Tahoma,Geneva,sans-serif><span
                                                                                                                    style=display:inline!important;float:none;font-style:normal;font-variant-caps:normal;font-variant-ligatures:normal;font-weight:400;letter-spacing:normal;text-align:start;text-decoration-color:initial;text-decoration-style:initial;text-indent:0;text-transform:none;white-space:normal;word-spacing:0>Thank
                                                                                                                    you
                                                                                                                    for
                                                                                                                    taking
                                                                                                                    the
                                                                                                                    time
                                                                                                                    to
                                                                                                                    share
                                                                                                                    your
                                                                                                                    thoughts
                                                                                                                    with
                                                                                                                    us,
                                                                                                                    and
                                                                                                                    we
                                                                                                                    look
                                                                                                                    forward
                                                                                                                    to
                                                                                                                    hearing
                                                                                                                    more
                                                                                                                    from
                                                                                                                    you
                                                                                                                    in
                                                                                                                    the
                                                                                                                    future.</span></span><br><br><span
                                                                                                                style=background-color:#fff;color:#222;font-family:Tahoma,Geneva,sans-serif><span
                                                                                                                    style=display:inline!important;float:none;font-style:normal;font-variant-caps:normal;font-variant-ligatures:normal;font-weight:400;letter-spacing:normal;text-align:start;text-decoration-color:initial;text-decoration-style:initial;text-indent:0;text-transform:none;white-space:normal;word-spacing:0>Best
                                                                                                                    regards,</span></span><br><span
                                                                                                                style=background-color:#fff;color:#222;font-family:Tahoma,Geneva,sans-serif><span
                                                                                                                    style=display:inline!important;float:none;font-style:normal;font-variant-caps:normal;font-variant-ligatures:normal;font-weight:400;letter-spacing:normal;text-align:start;text-decoration-color:initial;text-decoration-style:initial;text-indent:0;text-transform:none;white-space:normal;word-spacing:0>Ibrahim
                                                                                                                    BHMBS
                                                                                                                    from
                                                                                                                </span></span><i
                                                                                                                style=background-color:#fff;color:#222;font-family:Tahoma,Geneva,sans-serif;font-variant-caps:normal;font-variant-ligatures:normal;font-weight:400;letter-spacing:normal;text-align:start;text-decoration-color:initial;text-decoration-style:initial;text-indent:0;text-transform:none;white-space:normal;word-spacing:0>Programmers
                                                                                                                Life</i>
                                                                                                    </div>
                                                                                                </div>
                                                                                            </div>
                                                                                            <div>
                                                                                                <div>
                                                                                                    <table role=presentation
                                                                                                        style=font-family:Helvetica,Arial,serif;border-collapse:collapse
                                                                                                        width=100% cellpadding=0
                                                                                                        cellspacing=0>
                                                                                                        <tr>
                                                                                                            <td
                                                                                                                style="padding:10px 0;font-family:Helvetica,Arial,serif">
                                                                                                                <table
                                                                                                                    role=presentation
                                                                                                                    style="border-top:3px none #000;border-collapse:collapse;font-family:Helvetica,Arial,serif"
                                                                                                                    width=100%>
                                                                                                                    <tr>
                                                                                                                        <td style=font-family:Helvetica,Arial,serif
                                                                                                                            width=100%>
                                                                                                                </table>
                                                                                                    </table>
                                                                                                </div>
                                                                                            </div>
                                                                                            <div>
                                                                                                <div>
                                                                                                    <table role=presentation
                                                                                                        style=font-family:Helvetica,Arial,serif
                                                                                                        width=100% cellpadding=0
                                                                                                        cellspacing=0>
                                                                                                        <tr>
                                                                                                            <td
                                                                                                                style="padding:10px 0;font-family:Helvetica,Arial,serif">
                                                                                                                <table
                                                                                                                    role=presentation
                                                                                                                    style="border-top:2px solid #a5b6c0;border-collapse:collapse;font-family:Helvetica,Arial,serif"
                                                                                                                    width=100%>
                                                                                                                    <tr>
                                                                                                                        <td style=font-family:Helvetica,Arial,serif
                                                                                                                            width=100%>
                                                                                                                </table>
                                                                                                    </table>
                                                                                                </div>
                                                                                            </div>
                                                                                </table>
                                                                                <table role=presentation
                                                                                    style=width:100%;font-family:Helvetica,Arial,serif
                                                                                    class=m_-9118421173644749603aw-stack>
                                                                                    <tr>
                                                                                        <td style=padding:0;width:5.4%;font-family:Helvetica,Arial,serif
                                                                                            width=5.4%
                                                                                            class=m_-9118421173644749603container
                                                                                            valign=top>
                                                                                        <td style=padding:0;width:26.6%;font-family:Helvetica,Arial,serif
                                                                                            width=26.6%
                                                                                            class=m_-9118421173644749603container
                                                                                            valign=top>
                                                                                            <div><span>
                                                                                                    <table role=presentation
                                                                                                        style=float:none;text-align:center;font-family:Helvetica,Arial,serif;border-collapse:collapse
                                                                                                        width=100% align=center>
                                                                                                        <tr>
                                                                                                            <td style=padding:0;font-family:Helvetica,Arial,serif
                                                                                                                align=center>
                                                                                                                <img height=81
                                                                                                                    src="https://ci3.googleusercontent.com/proxy/Kv_-G60mmRO5_lse8oNlVUwSx-orhkF3JYKkeB37A4meyNzCiL4PXh7IvVSFgNrqVw40qF4q27TyHamXPgrnWThd6tyg1hwKiEDCHdGJ_tzlyA=s0-d-e1-ft#https://media.graphassets.com/z3ietlyT5SL9d2XTnBo7?t=1684014518"
                                                                                                                    style=display:block;width:148px;height:81px;border-width:0;border-style:none;line-height:100%;max-width:100%;outline-width:medium;outline-style:none;text-decoration:none
                                                                                                                    width=148
                                                                                                                    alt="">
                                                                                                    </table>
                                                                                                </span></div>
                                                                                        <td style="padding:0 30px;width:68%;font-family:Helvetica,Arial,serif"
                                                                                            width=68.0%
                                                                                            class=m_-9118421173644749603container
                                                                                            valign=top>
                                                                                            <div>
                                                                                                <div
                                                                                                    class="m_-9118421173644749603paragraph m_-9118421173644749603text-element">
                                                                                                    <div
                                                                                                        style=color:#242020;font-size:18px;font-weight:400;line-height:1.5em;text-align:left>
                                                                                                        <h3>23
                                                                                                            Must-Have
                                                                                                            VS Code
                                                                                                            Extensions
                                                                                                            for
                                                                                                            Developers
                                                                                                        </h3>
                                                                                                        <p
                                                                                                            style=color:#242020;font-size:18px;font-weight:400;line-height:1.5em;text-align:left>
                                                                                                            <span
                                                                                                                style=background-color:#fff;color:#374151;font-size:16px><span
                                                                                                                    style=display:inline!important;float:none;font-style:normal;font-variant-caps:normal;font-variant-ligatures:normal;font-weight:400;letter-spacing:normal;text-align:center;text-decoration-color:initial;text-decoration-style:initial;text-indent:0;text-transform:none;white-space:normal;word-spacing:0>Want
                                                                                                                    to
                                                                                                                    be
                                                                                                                    a
                                                                                                                    more
                                                                                                                    efficient
                                                                                                                    developer?
                                                                                                                    Discover
                                                                                                                    the
                                                                                                                    top
                                                                                                                    23
                                                                                                                    VS
                                                                                                                    Code
                                                                                                                    extensions
                                                                                                                    that
                                                                                                                    can
                                                                                                                    help
                                                                                                                    you
                                                                                                                    automate
                                                                                                                    tasks,
                                                                                                                    streamline
                                                                                                                    your
                                                                                                                    coding
                                                                                                                    process,
                                                                                                                    and
                                                                                                                    customize
                                                                                                                    your
                                                                                                                    development
                                                                                                                    environment.
                                                                                                                    Supercharge
                                                                                                                    your
                                                                                                                    productivity
                                                                                                                    and
                                                                                                                    check
                                                                                                                    out
                                                                                                                    our
                                                                                                                    must-have
                                                                                                                    tools
                                                                                                                    now!</span></span>
                                                                                                        <p
                                                                                                            style=color:#242020;font-size:18px;font-weight:400;line-height:1.5em;text-align:left>
                                                                                                            <a href=http://programmerslife.site/post/23-vs-code-extensions-developers
                                                                                                                target=_blank
                                                                                                                rel="noopener noreferrer"
                                                                                                                style=color:#5f9a2c;font-weight:700><span
                                                                                                                    style=color:#6b71e0;font-size:16px>Continue
                                                                                                                    reading
                                                                                                                    »</span></a>
                                                                                                    </div>
                                                                                                </div>
                                                                                            </div>
                                                                                </table>
                                                                                <table role=presentation
                                                                                    style=width:100%;font-family:Helvetica,Arial,serif
                                                                                    class=m_-9118421173644749603aw-stack>
                                                                                    <tr>
                                                                                        <td style=padding:0;width:100%;font-family:Helvetica,Arial,serif
                                                                                            width=100%
                                                                                            class=m_-9118421173644749603container
                                                                                            valign=top>
                                                                                            <div>
                                                                                                <div>
                                                                                                    <table role=presentation
                                                                                                        style=font-family:Helvetica,Arial,serif;border-collapse:collapse
                                                                                                        width=100% cellpadding=0
                                                                                                        cellspacing=0>
                                                                                                        <tr>
                                                                                                            <td
                                                                                                                style="padding:10px 0;font-family:Helvetica,Arial,serif">
                                                                                                                <table
                                                                                                                    role=presentation
                                                                                                                    style="border-top:3px none #000;border-collapse:collapse;font-family:Helvetica,Arial,serif"
                                                                                                                    width=100%>
                                                                                                                    <tr>
                                                                                                                        <td style=font-family:Helvetica,Arial,serif
                                                                                                                            width=100%>
                                                                                                                </table>
                                                                                                    </table>
                                                                                                </div>
                                                                                            </div>
                                                                                </table>
                                                                                <table role=presentation
                                                                                    style=width:100%;font-family:Helvetica,Arial,serif
                                                                                    class=m_-9118421173644749603aw-stack>
                                                                                    <tr>
                                                                                        <td style=padding:0;width:5.4%;font-family:Helvetica,Arial,serif
                                                                                            width=5.4%
                                                                                            class=m_-9118421173644749603container
                                                                                            valign=top>
                                                                                        <td style=padding:0;width:26.6%;font-family:Helvetica,Arial,serif
                                                                                            width=26.6%
                                                                                            class=m_-9118421173644749603container
                                                                                            valign=top>
                                                                                            <div><span>
                                                                                                    <table role=presentation
                                                                                                        style=float:none;text-align:center;font-family:Helvetica,Arial,serif;border-collapse:collapse
                                                                                                        width=100% align=center>
                                                                                                        <tr>
                                                                                                            <td style=padding:0;font-family:Helvetica,Arial,serif
                                                                                                                align=center>
                                                                                                                <img height=83
                                                                                                                    src="https://ci6.googleusercontent.com/proxy/iL-eOYy3x8qKc5vMKCWKe4LNhoFd6OBS3X69kQom9w2BIj6ECxtp1Ebgl868-C7jrWRQIz7wIvS53wbTnXRzIW28ldXxno9qcljdPmfdbBLMPw=s0-d-e1-ft#https://media.graphassets.com/Jumm4kDaR7ypjoYsSK8t?t=1684014518"
                                                                                                                    style=display:block;width:148px;height:83px;border-width:0;border-style:none;line-height:100%;max-width:100%;outline-width:medium;outline-style:none;text-decoration:none
                                                                                                                    width=148
                                                                                                                    alt="">
                                                                                                    </table>
                                                                                                </span></div>
                                                                                        <td style="padding:0 30px;width:68%;font-family:Helvetica,Arial,serif"
                                                                                            width=68.0%
                                                                                            class=m_-9118421173644749603container
                                                                                            valign=top>
                                                                                            <div>
                                                                                                <div
                                                                                                    class="m_-9118421173644749603paragraph m_-9118421173644749603text-element">
                                                                                                    <div
                                                                                                        style=color:#242020;font-size:18px;font-weight:400;line-height:1.5em;text-align:left>
                                                                                                        <h3>👨‍💻🤖
                                                                                                            AI
                                                                                                            Prompts
                                                                                                            and
                                                                                                            Tools:
                                                                                                            Enhancing
                                                                                                            Creativity
                                                                                                            and
                                                                                                            Efficiency
                                                                                                            in
                                                                                                            Writing
                                                                                                        </h3>
                                                                                                        <p
                                                                                                            style=color:#242020;font-size:18px;font-weight:400;line-height:1.5em;text-align:left>
                                                                                                            <span
                                                                                                                style=background-color:#fff;color:#374151;font-size:16px><span
                                                                                                                    style=display:inline!important;float:none;font-style:normal;font-variant-caps:normal;font-variant-ligatures:normal;font-weight:400;letter-spacing:normal;text-align:center;text-decoration-color:initial;text-decoration-style:initial;text-indent:0;text-transform:none;white-space:normal;word-spacing:0>To
                                                                                                                    learn
                                                                                                                    more
                                                                                                                    about
                                                                                                                    how
                                                                                                                    AI
                                                                                                                    prompts
                                                                                                                    and
                                                                                                                    tools
                                                                                                                    are
                                                                                                                    transforming
                                                                                                                    writing,
                                                                                                                    read
                                                                                                                    the
                                                                                                                    full
                                                                                                                    article.
                                                                                                                    Discover
                                                                                                                    their
                                                                                                                    advantages
                                                                                                                    and
                                                                                                                    limitations,
                                                                                                                    and
                                                                                                                    how
                                                                                                                    they
                                                                                                                    can
                                                                                                                    help
                                                                                                                    you
                                                                                                                    save
                                                                                                                    time
                                                                                                                    and
                                                                                                                    increase
                                                                                                                    productivity.
                                                                                                                    Click
                                                                                                                    now
                                                                                                                    to
                                                                                                                    stay
                                                                                                                    ahead
                                                                                                                    of
                                                                                                                    the
                                                                                                                    curve
                                                                                                                    in
                                                                                                                    this
                                                                                                                    rapidly-evolving
                                                                                                                    field.</span></span>
                                                                                                        <p
                                                                                                            style=color:#242020;font-size:18px;font-weight:400;line-height:1.5em;text-align:left>
                                                                                                            <a href=http://programmerslife.site/post/ai-prompts-and-tools
                                                                                                                target=_blank
                                                                                                                rel="noopener noreferrer"
                                                                                                                style=color:#5f9a2c;font-weight:700><span
                                                                                                                    style=color:#6b71e0;font-size:16px>Continue
                                                                                                                    reading
                                                                                                                    »</span></a>
                                                                                                    </div>
                                                                                                </div>
                                                                                            </div>
                                                                                </table>
                                                                                <table role=presentation
                                                                                    style=width:100%;font-family:Helvetica,Arial,serif
                                                                                    class=m_-9118421173644749603aw-stack>
                                                                                    <tr>
                                                                                        <td style=padding:0;width:100%;font-family:Helvetica,Arial,serif
                                                                                            width=100%
                                                                                            class=m_-9118421173644749603container
                                                                                            valign=top>
                                                                                            <div>
                                                                                                <div>
                                                                                                    <table role=presentation
                                                                                                        style=font-family:Helvetica,Arial,serif;border-collapse:collapse
                                                                                                        width=100% cellpadding=0
                                                                                                        cellspacing=0>
                                                                                                        <tr>
                                                                                                            <td
                                                                                                                style="padding:10px 0;font-family:Helvetica,Arial,serif">
                                                                                                                <table
                                                                                                                    role=presentation
                                                                                                                    style="border-top:3px none #000;border-collapse:collapse;font-family:Helvetica,Arial,serif"
                                                                                                                    width=100%>
                                                                                                                    <tr>
                                                                                                                        <td style=font-family:Helvetica,Arial,serif
                                                                                                                            width=100%>
                                                                                                                </table>
                                                                                                    </table>
                                                                                                </div>
                                                                                            </div>
                                                                                </table>
                                                                                <table role=presentation
                                                                                    style=width:100%;font-family:Helvetica,Arial,serif
                                                                                    class=m_-9118421173644749603aw-stack>
                                                                                    <tr>
                                                                                        <td style=padding:0;width:5.4%;font-family:Helvetica,Arial,serif
                                                                                            width=5.4%
                                                                                            class=m_-9118421173644749603container
                                                                                            valign=top>
                                                                                        <td style=padding:0;width:26.6%;font-family:Helvetica,Arial,serif
                                                                                            width=26.6%
                                                                                            class=m_-9118421173644749603container
                                                                                            valign=top>
                                                                                            <div><span>
                                                                                                    <table role=presentation
                                                                                                        style=float:none;text-align:center;font-family:Helvetica,Arial,serif;border-collapse:collapse
                                                                                                        width=100% align=center>
                                                                                                        <tr>
                                                                                                            <td style=padding:0;font-family:Helvetica,Arial,serif
                                                                                                                align=center>
                                                                                                                <img height=81
                                                                                                                    src="https://ci4.googleusercontent.com/proxy/nVCvSFjN0-jJukj9Y5y0yTMoEFgsUWdiX3b4ZX5I4qvqrQUbeGfwpgwpu30VMgcQPbFAqiuxCtic8lyikCcXg8EDOh3FMT1SZHZg-NA9u2aGBg=s0-d-e1-ft#https://media.graphassets.com/F3xhWwS4WcK5RBskYhoA?t=1684014518"
                                                                                                                    style=display:block;width:148px;height:81px;border-width:0;border-style:none;line-height:100%;max-width:100%;outline-width:medium;outline-style:none;text-decoration:none
                                                                                                                    width=148
                                                                                                                    alt="">
                                                                                                    </table>
                                                                                                </span></div>
                                                                                        <td style="padding:0 30px;width:68%;font-family:Helvetica,Arial,serif"
                                                                                            width=68.0%
                                                                                            class=m_-9118421173644749603container
                                                                                            valign=top>
                                                                                            <div>
                                                                                                <div
                                                                                                    class="m_-9118421173644749603paragraph m_-9118421173644749603text-element">
                                                                                                    <div
                                                                                                        style=color:#242020;font-size:18px;font-weight:400;line-height:1.5em;text-align:left>
                                                                                                        <h3>OpenStack
                                                                                                            Installation
                                                                                                            on
                                                                                                            Ubuntu:
                                                                                                            A
                                                                                                            Beginner's
                                                                                                            Step-by-Step
                                                                                                            Guide
                                                                                                        </h3>
                                                                                                        <p
                                                                                                            style=color:#242020;font-size:18px;font-weight:400;line-height:1.5em;text-align:left>
                                                                                                            <span
                                                                                                                style=background-color:#fff;color:#374151;font-size:16px><span
                                                                                                                    style=display:inline!important;float:none;font-style:normal;font-variant-caps:normal;font-variant-ligatures:normal;font-weight:400;letter-spacing:normal;text-align:center;text-decoration-color:initial;text-decoration-style:initial;text-indent:0;text-transform:none;white-space:normal;word-spacing:0>Discover
                                                                                                                    how
                                                                                                                    to
                                                                                                                    install
                                                                                                                    and
                                                                                                                    personalize
                                                                                                                    OpenStack
                                                                                                                    on
                                                                                                                    your
                                                                                                                    Ubuntu
                                                                                                                    Virtual
                                                                                                                    Machine
                                                                                                                    with
                                                                                                                    this
                                                                                                                    easy-to-follow
                                                                                                                    guide,
                                                                                                                    regardless
                                                                                                                    of
                                                                                                                    your
                                                                                                                    level
                                                                                                                    of
                                                                                                                    experience
                                                                                                                    with
                                                                                                                    the
                                                                                                                    platform.
                                                                                                                    Our
                                                                                                                    tutorial
                                                                                                                    provides
                                                                                                                    detailed
                                                                                                                    guidance
                                                                                                                    on
                                                                                                                    virtual
                                                                                                                    machine
                                                                                                                    creation,
                                                                                                                    storage
                                                                                                                    management,
                                                                                                                    and
                                                                                                                    tool
                                                                                                                    integration,
                                                                                                                    empowering
                                                                                                                    you
                                                                                                                    to
                                                                                                                    streamline
                                                                                                                    your
                                                                                                                    cloud
                                                                                                                    environment
                                                                                                                    effectively.
                                                                                                                    Acquire
                                                                                                                    valuable
                                                                                                                    skills
                                                                                                                    and
                                                                                                                    elevate
                                                                                                                    your
                                                                                                                    cloud
                                                                                                                    computing
                                                                                                                    expertise
                                                                                                                    with
                                                                                                                    OpenStack!</span></span>
                                                                                                        <p
                                                                                                            style=color:#242020;font-size:18px;font-weight:400;line-height:1.5em;text-align:left>
                                                                                                            <a href=http://programmerslife.site/post/openstack-installation
                                                                                                                target=_blank
                                                                                                                rel="noopener noreferrer"
                                                                                                                style=color:#5f9a2c;font-weight:700><span
                                                                                                                    style=color:#6b71e0;font-size:16px>Continue
                                                                                                                    reading
                                                                                                                    »</span></a>
                                                                                                    </div>
                                                                                                </div>
                                                                                            </div>
                                                                                </table>
                                                                                <table role=presentation
                                                                                    style=width:100%;font-family:Helvetica,Arial,serif
                                                                                    class=m_-9118421173644749603aw-stack>
                                                                                    <tr>
                                                                                        <td style=padding:0;width:100%;font-family:Helvetica,Arial,serif
                                                                                            width=100%
                                                                                            class=m_-9118421173644749603container
                                                                                            valign=top>
                                                                                            <div>
                                                                                                <div>
                                                                                                    <table role=presentation
                                                                                                        style=font-family:Helvetica,Arial,serif;border-collapse:collapse
                                                                                                        width=100% cellpadding=0
                                                                                                        cellspacing=0>
                                                                                                        <tr>
                                                                                                            <td
                                                                                                                style="padding:10px 0;font-family:Helvetica,Arial,serif">
                                                                                                                <table
                                                                                                                    role=presentation
                                                                                                                    style="border-top:3px none #000;border-collapse:collapse;font-family:Helvetica,Arial,serif"
                                                                                                                    width=100%>
                                                                                                                    <tr>
                                                                                                                        <td style=font-family:Helvetica,Arial,serif
                                                                                                                            width=100%>
                                                                                                                </table>
                                                                                                    </table>
                                                                                                </div>
                                                                                            </div>
                                                                                </table>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                                <div style=max-width:560px>
                                                                    <div>
                                                                        <div>
                                                                            <table role=presentation
                                                                                style=width:100%;font-family:Helvetica,Arial,serif;border-collapse:collapse
                                                                                class=m_-9118421173644749603aw-stack>
                                                                                <tr>
                                                                                    <td style="padding:30px 0 0;width:100%;font-family:Helvetica,Arial,serif"
                                                                                        width=100%
                                                                                        class=m_-9118421173644749603container
                                                                                        valign=top>
                                                                            </table>
                                                                            <table role=presentation
                                                                                style=width:100%;font-family:Helvetica,Arial,serif;border-collapse:collapse>
                                                                                <tr>
                                                                                    <td style=padding:0;width:17%;font-family:Helvetica,Arial,serif
                                                                                        width=17%
                                                                                        class=m_-9118421173644749603container
                                                                                        valign=top>
                                                                                    <td style=padding:0;width:10%;font-family:Helvetica,Arial,serif
                                                                                        width=10%
                                                                                        class=m_-9118421173644749603container
                                                                                        valign=top>
                                                                                        <div><span>
                                                                                                <table role=presentation
                                                                                                    style=float:none;text-align:center;font-family:Helvetica,Arial,serif;border-collapse:collapse
                                                                                                    width=100% align=center>
                                                                                                    <tr>
                                                                                                        <td style=padding:0;font-family:Helvetica,Arial,serif
                                                                                                            align=center>
                                                                                                            <a href=https://www.facebook.com/mindh4q3rr/
                                                                                                                target=_blank><img
                                                                                                                    height=30
                                                                                                                    src="https://ci4.googleusercontent.com/proxy/cGlbppXDvdWPNxwcwninEJbT5tkqkq3s61v8OGAIVeTX4peOejrCIOpu0nr95LgM63gbQDzjcv95f48dh1GQG6noElkZ3EOemuaDkae0Og-XBQjufMHhQKVhVMjqcIjTqraB9_HirgZp=s0-d-e1-ft#https://assets.mlcdn.com/ml/images/icons/default/round/color/facebook.png?t=1684014518"
                                                                                                                    style=display:block;width:30px;height:30px;border-width:0;border-style:none;line-height:100%;max-width:560px;outline-width:medium;outline-style:none;text-decoration:none
                                                                                                                    width=30
                                                                                                                    alt="Facebook Page"></a>
                                                                                                </table>
                                                                                            </span></div>
                                                                                    <td style=padding:0;width:10%;font-family:Helvetica,Arial,serif
                                                                                        width=10%
                                                                                        class=m_-9118421173644749603container
                                                                                        valign=top>
                                                                                        <div><span>
                                                                                                <table role=presentation
                                                                                                    style=float:none;text-align:center;font-family:Helvetica,Arial,serif;border-collapse:collapse
                                                                                                    width=100% align=center>
                                                                                                    <tr>
                                                                                                        <td style=padding:0;font-family:Helvetica,Arial,serif
                                                                                                            align=center>
                                                                                                            <a href=https://twitter.com/mindh4q3rr
                                                                                                                target=_blank><img
                                                                                                                    height=30
                                                                                                                    src="https://ci3.googleusercontent.com/proxy/o4aHistCwFRPz4M7_V2IuJcwP1yhDtbnoTd4Xo7XTqDTw5eiNzgbJolyv0QLGgz-gzrAIf57kD7RFo5_eH9VaNErpL5jRCSw4LHh9zzdKNmG9SbBm4KSJ19jHR4q_7lC42INugrovks=s0-d-e1-ft#https://assets.mlcdn.com/ml/images/icons/default/round/color/twitter.png?t=1684014518"
                                                                                                                    style=display:block;width:30px;height:30px;border-width:0;border-style:none;line-height:100%;max-width:560px;outline-width:medium;outline-style:none;text-decoration:none
                                                                                                                    width=30
                                                                                                                    alt="Twitter Page"></a>
                                                                                                </table>
                                                                                            </span></div>
                                                                                    <td style=padding:0;width:10%;font-family:Helvetica,Arial,serif
                                                                                        width=10%
                                                                                        class=m_-9118421173644749603container
                                                                                        valign=top>
                                                                                        <div><span>
                                                                                                <table role=presentation
                                                                                                    style=float:none;text-align:center;font-family:Helvetica,Arial,serif;border-collapse:collapse
                                                                                                    width=100% align=center>
                                                                                                    <tr>
                                                                                                        <td style=padding:0;font-family:Helvetica,Arial,serif
                                                                                                            align=center>
                                                                                                            <a href=https://www.instagram.com/mindh4q3r/
                                                                                                                target=_blank><img
                                                                                                                    height=30
                                                                                                                    src="https://ci5.googleusercontent.com/proxy/-UYMXJ2qGXMGhMYej5c5ecj662R1qa1IDiBUrENhxQHT10FfvWHTKyx_dkPD8ALApce33_ADlezfD8YWmvWaSloxv1yabdUd3mhNRmhMtcUDj_9Pmwz-NqyrePqneUBnndZHcnf8OjVPsQ=s0-d-e1-ft#https://assets.mlcdn.com/ml/images/icons/default/round/color/instagram.png?t=1684014518"
                                                                                                                    style=display:block;width:30px;height:30px;border-width:0;border-style:none;line-height:100%;max-width:560px;outline-width:medium;outline-style:none;text-decoration:none
                                                                                                                    width=30
                                                                                                                    alt="Instagram Page"></a>
                                                                                                </table>
                                                                                            </span></div>
                                                                                    <td style=padding:0;width:10%;font-family:Helvetica,Arial,serif
                                                                                        width=10%
                                                                                        class=m_-9118421173644749603container
                                                                                        valign=top>
                                                                                        <div><span>
                                                                                                <table role=presentation
                                                                                                    style=float:none;text-align:center;font-family:Helvetica,Arial,serif;border-collapse:collapse
                                                                                                    width=100% align=center>
                                                                                                    <tr>
                                                                                                        <td style=padding:0;font-family:Helvetica,Arial,serif
                                                                                                            align=center>
                                                                                                            <a href=https://www.linkedin.com/in/ibrahimbs/
                                                                                                                target=_blank><img
                                                                                                                    height=30
                                                                                                                    src="https://ci5.googleusercontent.com/proxy/T7IBwZ8nzbpZ_AjDRZnrsH-2_JpORiFcXvQBEbljOCRfj57u8eknlUnrlSmNF7Z9YZR9a-useNfc3TMiAE5AEk3EqnakY6d5b35qKzvfvP83VtgjmdeNiA_y2wGtqtS7l7RmCVb7cywv=s0-d-e1-ft#https://assets.mlcdn.com/ml/images/icons/default/round/color/linkedin.png?t=1684014518"
                                                                                                                    style=display:block;width:30px;height:30px;border-width:0;border-style:none;line-height:100%;max-width:560px;outline-width:medium;outline-style:none;text-decoration:none
                                                                                                                    width=30
                                                                                                                    alt="LinkedIn Profile"></a>
                                                                                                </table>
                                                                                            </span></div>
                                                                                    <td style=padding:0;width:10%;font-family:Helvetica,Arial,serif
                                                                                        width=10%
                                                                                        class=m_-9118421173644749603container
                                                                                        valign=top>
                                                                                        <div><span>
                                                                                                <table role=presentation
                                                                                                    style=float:none;text-align:center;font-family:Helvetica,Arial,serif;border-collapse:collapse
                                                                                                    width=100% align=center>
                                                                                                    <tr>
                                                                                                        <td style=padding:0;font-family:Helvetica,Arial,serif
                                                                                                            align=center>
                                                                                                            <a href=https://linktr.ee/programmerslife
                                                                                                                target=_blank><img
                                                                                                                    height=30
                                                                                                                    src="https://ci4.googleusercontent.com/proxy/y4Diw2WZ0yAcRM6WSgp-bXuXj2JxGQdRpTpCddf3UKFtD82vbhwltfOL0wL9eqTrCyc-RO1e7bqE1hDyUunF9M85sLpATmz4pExjhYptBwfsh-vawoSuRn7FQClHaTEYElo6DygNr_o=s0-d-e1-ft#https://assets.mlcdn.com/ml/images/icons/default/round/color/youtube.png?t=1684014518"
                                                                                                                    style=display:block;width:30px;height:30px;border-width:0;border-style:none;line-height:100%;max-width:560px;outline-width:medium;outline-style:none;text-decoration:none
                                                                                                                    width=30
                                                                                                                    alt="YouTube Channel"></a>
                                                                                                </table>
                                                                                            </span></div>
                                                                                    <td style=padding:0;width:19%;font-family:Helvetica,Arial,serif
                                                                                        width=19%
                                                                                        class=m_-9118421173644749603container
                                                                                        valign=top>
                                                                            </table>
                                                                            <table role=presentation
                                                                                style=width:100%;font-family:Helvetica,Arial,serif;border-collapse:collapse
                                                                                class=m_-9118421173644749603aw-stack>
                                                                                <tr>
                                                                                    <td style="padding:30px 0 0;width:100%;font-family:Helvetica,Arial,serif"
                                                                                        width=100%
                                                                                        class=m_-9118421173644749603container
                                                                                        valign=top>
                                                                            </table>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                </table>
                                            </div>
                                        </div>
                                        <div><br></div>
                                    </div>
                                </div>
                    </table>
                    <div style=background-color:#fff;width:100%!important id=m_-9118421173644749603aweber_container
                        align=center>
                        <div style="box-sizing:border-box;color:#000!important;font-family:Helvetica,Arial,sans-serif!important;font-size:12px!important;line-height:16px;margin:0;max-width:600px;padding:0 8px;width:100%"
                            id=m_-9118421173644749603aweber_rem>
                            <div style=text-align:center><br><span style=color:#000!important>Programmers Life<br>📞
                                    +21652777039<br>📧 contact@programmerslife.site<br>🏠 47
                                    Saada ST, Nabeul<br>🌐 www.programmerslife.site<br><br>47
                                    Saada ST, Nabeul<br>Tunis Tunis
                                    8080<br>TUNISIA</span><br><br><a
                                    href="https://www.aweber.com/z/r/?bKxMnEzMTLRMjMzs7Gzs7JzMtEa0rKwsHJyczGw=" target=_blank
                                    rel="noopener noreferrer" style=color:#000><span
                                        style=color:#000!important>Unsubscribe</span></a> | <a
                                    href="https://www.aweber.com/z/r/?bKxMnEzMTLRMjMzs7Gzs7JzMtEa0rKwsHJyczGw=" target=_blank
                                    rel="noopener noreferrer" style=color:#000><span style=color:#000!important>Change
                                        Subscriber Options</span></a><br><br></div>
                        </div>
                    </div>
                </div>
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