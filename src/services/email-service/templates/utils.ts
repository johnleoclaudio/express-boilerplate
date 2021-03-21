export type Json = { [key: string]: any };

/**
 * This is the base template creation function.
 * @param headTitle - The page title. This is the `title` element in `head` element.
 * @param icon - Icon to display for the e-mail.
 * @param title - Title of the e-mail template
 * @param message - Message of the email template. This is displayed below the [title]. This can contain html tags but must be on String.
 * @param content - The message or details displayed below the [message]. This varies depending on the e-mail.  This can contain html tags but must  be on String.
 */
export function createTemplate(
  headTitle: string,
  icon: string,
  title: string,
  message: string,
  content?: string,
): string {
  return `
    <!DOCTYPE html>
    <html>
        <!--${createHead(headTitle)}-->
        <body>
          ${createHead(headTitle)}
          <table width="100%" border="0" cellspacing="0" cellpadding="0">
              <tr>
                  <td align="center">
                      ${createContainer(icon, title, message, content)}
                  </td>
              </tr>
          </table>
        </body>
    </html>
    `;
}

export function createHead(title): string {
  return `
  <head>
  <meta name=”x-apple-disable-message-reformatting” />
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>${title}</title>
  <style>
    body {
      font-family: Arial, sans-serif;
      padding: 0;
    }
    .template-container {
      max-width: 601px;
      width: 100%;
      background-color: #ffffff !important;
      border: 1px solid #3a3a3a;
      /*left: 50%; transform: translateX(-50%);*/
    }
    .center {
      left: 50%;
      transform: translateX(-50%);
    }
    .template-content {
      background-color: #ffffff !important;
      margin: 49px 68px;
      position: relative;
      /*width: 100%;*/
      /*box-sizing: border-box;*/
      /*min-height: 686px;*/
      overflow: hidden;
    }
    .template-title {
      font-family: Arial;
      font-size: 24px;
      font-weight: bold;
      text-align: center;
      color: #bf201a;
    }
    .template-message {
      font-family: Arial;
      color: #2c3e50;
      line-height: 2.06;
      font-size: 16px;
      text-align: center;
    }
    .template-message > div.spacer {
        height: 16px;
    }
    .cta-container {
      text-align: center;
    }
    .cta-button {
      min-width: 250px;
      border-radius: 10px;
      background-color: #FF8000;
      padding: 17px 29px;
      font-size: 16px;
      text-align: center;
      color: #ffffff !important;
      text-transform: uppercase;
      text-decoration: none;
      display: inline-block;
      margin-bottom: 12px;
    }
    .template-footer {
      background-color: #e6e6e6;
      padding: 25px 0px;
      color: #2c3e50;
      text-align: center;
      line-height: 2.06;
      font-size: 16px;
      }
    .info-form-container {
      color: #333333;
      font-size: 16px;
    }
    .info-form-field {
      display: flex; flex-direction: row;
      margin-bottom: 4px;
    }
    .info-form-field label, .info-form-field span {
      flex-grow: 1;
    }
    .info-form-field label {
      font-weight: bold;
    }
    .info-form-field span {
      text-align: right;
    }
    .divider {
      margin: 24px 0px;
      height: 1px;
      background-color: #c9c9c9;
      opacity: 0.5;
    }
    .spacing-1 {
        height: 20px;
    }
    .spacing-2 {
        height: 40px;
    }
  </style>
</head>
  `;
}

export function createFooter() {
  return `
        <footer class="template-footer">
        <span>This is a system-generated email. Please do not respond. For questions and concerns, kindly contact us at </span>
            <!-- A bit of space here-->
            <div class="spacer"></div>
            <a href="mailto:bonds.ph@unionbankph.com">bonds.ph@unionbankph.com</a>.
        </footer>
    `;
}

/**
 *
 * Creates the container template.
 *
 * @param {*} icon - Action icon for the e-mail template. This is the big icon below the Bayani Bonds logo.
 * @param {*} title - Title of e-mail template. This is displayed below the [icon]
 * @param {*} message - Message of the e-mail template. This can be a String or a HTML elements.
 * @param {*} content - Action button(s) for the e-mail template. This should be a HTML element(s).
 */
export function createContainer(
  icon: string,
  title: string,
  message: string,
  content?: string,
) {
  return `
        <div class="template-container"> 
            <div class="template-content">
                <div style="text-align: center">
                    <img 
                        src="https://premyo-dev-ap-southeast-1.s3-ap-southeast-1.amazonaws.com/premyo/email/assets/rop-logo.png" 
                        height="100" 
                        width="320"
                        style="position: relative;"
                    />
                </div>
                <div style="height: 78px;"></div>
                <div style="text-align: center">
                    <img 
                        src="${icon}"
                        height="120"
                        width="140"
                        style="position: relative;"
                    />
                </div>
                <!-- Email Template Title-->
                <div style="height: 16px;"></div>
                <h1 class="template-title">${title}</h1>
                <div style="height: 16px;"></div>
    
                <!-- Email Template Message -->
                <div class="template-message">
                    ${message}
                </div>
                ${
                  content == null
                    ? ''
                    : `
                    <div style="height: 40px;"></div>
                    ${content}
                    `
                }
            </div>
            ${createFooter()}
        </div>
    `;
}

/**
 * Create a CTA Div container. This handles adding styles for the `anchor` elements.
 * @param cta
 */
export function createCTAContainer(cta: string) {
  return `
    <div class="cta-container">
        ${cta}
    </div>
    `;
}

/**
 * Create a `anchor` element.
 * @param label
 * @param href
 */
export function createCTAButton(label: string, href: string) {
  return `
        <a class="cta-button" href="${href}">
            <span>${label}</span>
        </a>
    `;
}

export function createFormValues(json: Json) {
  const items: string[] = [];
  for (var key in json) {
    const value = json[key];
    items.push(createFieldValueItem(key, value));
  }
  return `
    <table class="info-form-container" style="width: 100%">
        ${items.join('\n')}
    </table>
    `;
}

export function createFieldValueItem(label: string, value: any) {
  return `
  <tr class="info-form-field">
    <td style="width: 50%">
        <label>${label}:</label>
    </td>
    <td style="width: 50%; text-align: right">
        <span>${value}</span>
    </td>
  </tr>
  `;
}

export function createDivider() {
  return `
    <div class="divider"></div>
    `;
}

export function createMessage(message: string) {
  return `
    <div class="template-message">${message}</div>
    `;
}

/**
 * Create a spacing div.
 * @param isHalve - If spacing height should be reduce by half. Default spacing is 40px.
 */
export function createSpacing(isHalve?: boolean) {
  const cls = isHalve ? 'spacing-1' : 'spacing-2';

  return `<div class="${cls}"></div>`;
}

export function createList(items: string[]) {
  return `
    <ol style="padding: 0px; text-align: left">
        ${items
          .map(item => `<li style="margin-left: 20px">${item}</li>`)
          .join('')}
    </ol>
  `;
}

export function createAdminFooter() {
  return `
        <footer class="template-footer">
        <span>If you have any question and concern, <br> kindly contact Bonds.PH Admin Manager.</span>
        </footer>
    `;
}

export function createAdminHead(title): string {
  return `
  <head>
  <meta name=”x-apple-disable-message-reformatting” />
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>${title}</title>
  <style>
    body {
      font-family: Arial, sans-serif;
      padding: 0;
    }
    .template-container {
      max-width: 601px;
      width: 100%;
      background-color: #ffffff !important;
      border: 1px solid #3a3a3a;
      /*left: 50%; transform: translateX(-50%);*/
    }
    .center {
      left: 50%;
      transform: translateX(-50%);
    }
    .template-content {
      background-color: #ffffff !important;
      margin: 49px 68px;
      position: relative;
      /*width: 100%;*/
      /*box-sizing: border-box;*/
      /*min-height: 686px;*/
      overflow: hidden;
    }
    .template-title {
      font-family: Arial;
      font-size: 24px;
      font-weight: bold;
      text-align: center;
      color: #ff8000;
    }
    .template-message {
      font-family: Arial;
      color: #2c3e50;
      line-height: 2.06;
      font-size: 16px;
      text-align: center;
    }
    .template-message > div.spacer {
        height: 16px;
    }
    .cta-container {
      text-align: center;
    }
    .cta-button {
      min-width: 250px;
      border-radius: 10px;
      background-color: #FF8000;
      padding: 17px 29px;
      font-size: 16px;
      text-align: center;
      color: #ffffff !important;
      text-transform: uppercase;
      text-decoration: none;
      display: inline-block;
      margin-bottom: 12px;
    }
    .template-footer {
      background-color: #e6e6e6;
      padding: 25px 0px;
      color: #2c3e50;
      text-align: center;
      line-height: 2.06;
      font-size: 16px;
      }
    .info-form-container {
      color: #333333;
      font-size: 16px;
    }
    .info-form-field {
      display: flex; flex-direction: row;
      margin-bottom: 4px;
    }
    .info-form-field label, .info-form-field span {
      flex-grow: 1;
    }
    .info-form-field label {
      font-weight: bold;
    }
    .info-form-field span {
      text-align: right;
    }
    .divider {
      margin: 24px 0px;
      height: 1px;
      background-color: #c9c9c9;
      opacity: 0.5;
    }
    .spacing-1 {
        height: 20px;
    }
    .spacing-2 {
        height: 40px;
    }
  </style>
</head>
  `;
}

/**
 *
 * Creates the container template.
 *
 * @param {*} icon - Action icon for the e-mail template. This is the big icon below the Bayani Bonds logo.
 * @param {*} title - Title of e-mail template. This is displayed below the [icon]
 * @param {*} message - Message of the e-mail template. This can be a String or a HTML elements.
 * @param {*} content - Action button(s) for the e-mail template. This should be a HTML element(s).
 */
export function createAdminContainer(
  icon: string,
  title: string,
  message: string,
  content?: string,
) {
  return `
        <div class="template-container"> 
            <div class="template-content">
                <div style="height: 78px;"></div>
                <div style="text-align: center">
                    <img 
                        src="${icon}"
                        height="120"
                        width="140"
                        style="position: relative;"
                    />
                </div>
                <!-- Email Template Title-->
                <div style="height: 16px;"></div>
                <h1 class="template-title">${title}</h1>
                <div style="height: 16px;"></div>
    
                <!-- Email Template Message -->
                <div class="template-message">
                    ${message}
                </div>
                ${
                  content == null
                    ? ''
                    : `
                    <div style="height: 40px;"></div>
                    ${content}
                    `
                }
            </div>
            ${createAdminFooter()}
        </div>
    `;
}

export function createAdminEmailTemplate(
  headTitle: string,
  icon: string,
  title: string,
  message: string,
  content?: string,
): string {
  return `
    <!DOCTYPE html>
    <html>
        <body>
        ${createAdminHead(headTitle)}
          <table width="100%" border="0" cellspacing="0" cellpadding="0">
              <tr>
                  <td align="center">
                      ${createAdminContainer(icon, title, message, content)}
                  </td>
              </tr>
          </table>
        </body>
    </html>
    `;
}
