const template = (name:string,topic:string,time:string,date:string,avatar:string='https://lokichatdev.blob.core.windows.net/images/refferal-management/02.png') => {
    return `
    <!doctype html>
<html>
<head>
	<meta charset="utf-8">
	<meta name="viewport" content="width=device-width, user-scalable=no, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
	<title>Loki Chat | Email Debate request</title>
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

			<div class="rt-templatecontent" style="width: 100%; padding:33px 28px; margin-bottom: 16px; background-color: #FFFFFF;  border-radius: 12px; -moz-box-sizing: border-box; -webkit-box-sizing: border-box; box-sizing: border-box;">
				<div style="width: 100%; text-align: left;">
					<h1 class="rt-headingtext" style="margin: 0; font-size: 1.625rem; line-height: 1.3; font-weight: 700; color: #0a0c17;text-align:left">Debate Request</h1>
					<p class="rt-paragraphtext" style="margin: 0; font-size: 1.125rem; font-weight: 400; line-height: 1.5; color: #6C7275; padding-top: 1.5rem;">I hope this message finds you well. I am writing to formally inform you that <span style="font-weight: 700;color: #0a0c17;">${name}</span> has invited you to join the debate on a topic that I believe will spark an engaging and insightful discussion.</p>
					<p class="rt-paragraphtext" style="margin: 0; font-size: 1.125rem; font-weight: 400; line-height: 1.5; color: #6C7275; padding-top: 1.5rem;">We eagerly await your response and hope to have you as an integral part of this debate.</p>
                </div>
                <div class="rt-templatecontent" style="margin-top: 24px;">
                    <h1 class="rt-headingtext" style="margin: 0; font-size: 1.25rem; line-height: 1.3; font-weight: 700;color:#343839; text-align:left;margin-bottom: 16px;">Debate Details:</h1>
                 
                     <div style="width: 100%; text-align: left; background-color: #F3F3F3;border-radius: 8px; overflow: hidden; border: 1px solid #D1D3D3;">
                         <div style="padding: 13px 16px;border-bottom: 1px solid #6C727580;padding-bottom: 30px;">
                             <p style="margin: 0; font-size: 14px; font-weight: 500; color: #141718; line-height: 1.5;float: left;">Topic</p>
                             <p style="margin: 0; font-size: 13px; font-weight: 400; color: #6C7275; line-height: 1.5;float: right;">${topic}</p>
                         </div>
                         <div style="padding: 13px 16px;border-bottom: 1px solid #6C727580;padding-bottom: 30px;">
                             <p style="margin: 0; font-size: 14px; font-weight: 500; color: #141718; line-height: 1.5;float: left;">Time</p>
                             <p style="margin: 0; font-size: 13px; font-weight: 400; color: #6C7275; line-height: 1.5;float: right;">${time}</p>
                         </div>
                         <div style="padding: 13px 16px;padding-bottom: 30px;">
                             <p style="margin: 0; font-size: 14px; font-weight: 500; color: #141718; line-height: 1.5;float: left;">Date</p>
                             <p style="margin: 0; font-size: 13px; font-weight: 400; color: #6C7275; line-height: 1.5;float: right;">${date}</p>
                         </div>
                 </div>
                 </div>  
                 <div style="padding: 0; margin-top: 18px;">
                    <div  style="margin: 0; padding: 0; display: inline-block; vertical-align: middle;">
                        <div class="profile-Img" style="width: 70px; height: 70px; border-radius: 50%; border: 1px solid #000000; display: inline-block; padding: 5px;">
                            <img src="${avatar}" alt="" style="width: 100%; height: 100%; display: inline-block; vertical-align:middle; object-fit: cover;">  
                        </div>
                        <div style="display: inline-block; vertical-align: middle; margin-left: 8px;">
                            <p style="color:#343839; font-size: 16px; margin: 0;">${name}</p>
                            <p style="color:#6C7275;font-size: 12px; font-weight: 500;margin: 0;">Debate organizer</p>
                        </div>
                    </div>
                    <a href="javascript:void(0);" style="text-decoration: none; display: inline-block; vertical-align: middle;">
                        <div class="view-btn" style="margin-left: 6.6rem; display: inline-block; padding: 13px 0px; width: 237px; background-color: #1A90FF; text-align: center; border-radius: 8px; color: white; font-size: 16px; vertical-align: middle;">
                            View Invitation
                        </div>
                    </a>
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
			.view-btn{
				display: block !important;
				margin-left: 0 !important;
				margin-top: 20px !important;
			}
			.profile-Img{
				width: 50px !important;
				height: 50px !important;
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
</html>
    `
} 
export default template;