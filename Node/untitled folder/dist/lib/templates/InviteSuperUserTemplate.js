"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const template = (name, invitationCode) => {
    console.log(name, invitationCode, "invitationcode");
    return `<!doctype html>
    <html>
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, user-scalable=no, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0">
        <meta http-equiv="X-UA-Compatible" content="ie=edge">
        <title>Loki Chat | Email Welcome</title>
        <meta name="description" content="">
        <link rel="icon" href="../email-templates/images/favicon.png">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <link rel="preconnect" href="https://fonts.googleapis.com">
        <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap" rel="stylesheet">
    </head>
    <body style="margin: 0; font-family: 'Inter', sans-serif;">
        <div style="overflow: auto; position: relative; background: #ececec;">
            <div class="rt-emailtemplatesection" style="max-width: 37.5rem; margin: 0.5rem auto; padding: 22px 32px; background: url(https://lokichatdev.blob.core.windows.net/loki-templates/bg.png) no-repeat; background-size: cover;  overflow: hidden; width: 100%; position: relative;">
                <div class="rt-logo" style=" width:7.688rem; height:2.25rem; margin-bottom: 32px;">
                    <a href="javascript:void(0);" style="display: block;">
                        <img src="https://lokichatdev.blob.core.windows.net/loki-templates/loki-logo.png" alt="" style="width: 100%; height: 100%; display: block;">
                    </a>
                </div>        
                    <div class="rt-userimage" style="margin-bottom:16px; width:100%; height:10.125rem;">
                        <img src="https://lokichatdev.blob.core.windows.net/loki-templates/welcome-banner.png" alt="banner" style="width: 100%; height: 100%; display: block; border-radius: 12px;">
                    </div>
                <div class="rt-templatecontent" style="width: 100%; padding:33px 28px; margin-bottom: 16px; background-color: #FFFFFF; border: 1px solid #D9D6C6; border-radius: 12px; -moz-box-sizing: border-box; -webkit-box-sizing: border-box; box-sizing: border-box;">
                    <div style="width: 100%; text-align: left;">
                        <h1 class="rt-headingtext" style="margin: 0; font-size: 1.625rem; line-height: 1.3; font-weight: 700; color: #0a0c17; text-align: left;">Welcome to Loki Chat!</h1>
                        <p class="rt-paragraphtext" style="margin: 0; font-size: 1.125rem; font-weight: 400; line-height: 1.5; font-weight: 400; color: #444; padding-top:1.5rem;">Hi <span style="font-weight: 700;">${name}</span></p>
                        <p class="rt-paragraphtext" style="margin: 0; font-size: 1rem; font-weight: 400; line-height: 1.5; color: #6C7275; padding-top: 1.5rem;">We understand that your journey as a student is filled with ambitions, challenges, and the pursuit of excellence. To help you make the most of your educational experience and reach your goals, we'd like to offer some guidance on effective goal management.</p>
                        <p class="rt-paragraphtext" style="margin: 0; font-size: 1.25rem; font-weight: 400; line-height: 1.5; color: #444; padding-top: 1.5rem;">
                            Thanks,
                            <span style="display: block; font-weight: 600;">Loki Chat</span>
                        </p>
                    </div>
                </div>
            
                <div class="rt-footercontent" style="width: 100%; text-align: center; border-radius: 12px; background-color: #343839;">
                    <div class="rt-getlokichat" style="max-width: 23rem; margin: auto; padding: 1.75rem;">
                        <h4 style="margin-top: 0; margin-bottom: 16px; font-size: 1.125rem; line-height: 1.3; font-weight: 600; color: white;">Get the Lokichat app!</h4>
                        <p style="color: #C5C7C7; font-size: 0.75rem; text-align: center; margin-bottom: 16px;">Get the most of Lokichat by installing our mobile app. You can log in by using your existing email address and password</p>
                        <div class="footer-img" style="margin-bottom: 50px;">
                            <a href="javascript:void(0);" style="display:inline-block;vertical-align:middle">
                                <div class="btn-downloadapp btn-googleplay" style="width: 150px; height: 38px; display:inline-block; text-decoration:none; vertical-align: middle;">
                                    <img src="https://lokichatdev.blob.core.windows.net/loki-templates/google-play.png" alt="play-store" style="width: 100% ;height:100%" />
                                </div>
                            </a>  
                            <a href="javascript:void(0);" style="display:inline-block;vertical-align:middle">
                                <div class="btn-downloadapp btn-ios" style="width: 150px; height: 38px; display:inline-block; text-decoration:none; vertical-align: middle; margin-left: 6px;">
                                    <img src="https://lokichatdev.blob.core.windows.net/loki-templates/app-store.png" alt="play-store" style="width: 100% ;height:100%" />
                                </div>
                            </a> 
                        </div>
                        <p style="margin: 0; font-size: 0.75rem; text-align: center; line-height: 1.5; color:white; font-weight: 500;">© 2023 Lokichat. All rights reserved.</p>
                    </div>
                </div>
            </div>
        </div>
        <style>
            @media screen and (max-width: 640px) {
                html { font-size: 62.5% !important; }
                .rt-templatecontent{ padding-top: 2rem !important; }
                .rt-termspolicycontent li a{ font-size: 1.25rem !important;}
                .rt-termspolicycontent{ 
                    width: 40.5rem !important;
                    padding: 1.5rem 1rem !important; 
                }
                .rt-termspolicycontent li { padding: 0 1rem !important;}
                .rt-socialsection li a img{
                    width: 1.5rem !important;
                    height: 1.3rem !important;
                    padding: 0.6rem 0 !important;
                }
                .rt-btn {
                    font-size: 1.25rem !important;
                    min-width: 16.75rem !important;
                }
                .rt-paragraphtext{font-size: 1.5rem !important;}
                .btn-ios{
                    margin-top: 10px !important;
                    margin-left: 0 !important;
                }
            }
            @media screen and (max-width: 430px) {
                .rt-emailtemplatesection{ 
                    padding: 20px !important;
                    max-width: 30.5rem !important;
                }
                .rt-termspolicycontent { width: 30.5rem !important; }
                .rt-sendotpcode ul li p { line-height: 5.6rem !important; }
                .footer-img { margin-bottom: 30px !important; }
                .rt-emailtemplatesection{
                    padding: 14px !important;
                }
                .rt-templatecontent{
                    padding: 14px !important;
                }
                .rt-logo{
                    margin-bottom: 16px !important;
                }
            }
            @media screen and (max-width: 400px) {
                .rt-logosocialsection{
                    padding: 1.5rem 1.5rem 2rem !important;
                }
                .rt-termspolicycontent { width: 33.5rem !important; }
                .rt-emailtemplatesection{ width: 29.5rem !important; }
            }
        </style>
    </body>
    </html>`;
};
exports.default = template;
//# sourceMappingURL=InviteSuperUserTemplate.js.map