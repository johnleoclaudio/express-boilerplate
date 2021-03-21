import {
  createAdminEmailTemplate,
  createCTAButton,
  createCTAContainer,
  createDivider,
  createFormValues,
  createList,
  createMessage,
  createSpacing,
  createTemplate,
  Json,
} from './utils';

export function createVerifyAccountTemplate(href: string) {
  return createTemplate(
    'Confirm Account',
    'https://premyo-dev-ap-southeast-1.s3-ap-southeast-1.amazonaws.com/premyo/email/assets/email.png',
    'Just One More Step',
    `
      Thank you for joining!
      <br/> 
      <br/> 
      Click the button below to confirm your email address and complete your registration.
      <br/> 
      <br/> 
      The link will expire in 24 hours.
    `,
    `
        ${createCTAContainer(createCTAButton('Confirm E-mail address', href))}
        `,
  );
}

export function createPasswordUpdatedTemplate(json: Json): string {
  return createTemplate(
    'PIN Updated',
    'https://premyo-dev-ap-southeast-1.s3-ap-southeast-1.amazonaws.com/premyo/email/assets/lock.png',
    'PIN Updated',
    'You have successfully changed your password',
    `
        ${createFormValues(json)}
        `,
  );
}

export function createNewLoginDetectedTemplate(json: Json): string {
  return createTemplate(
    'New Login Detected',
    'https://premyo-dev-ap-southeast-1.s3-ap-southeast-1.amazonaws.com/premyo/email/assets/lock.png',
    'New Login Detected',
    `
            You recently logged in to your Bonds.PH account.
            <div class="message-line-break"></div>
            As a security measure, please check the following login information to make sure that you initiated this activity:
        `,
    `
        ${createFormValues(json)}
        `,
  );
}

export function createMultipleLoginDetectedTemplate(json: Json): string {
  return createTemplate(
    'Multiple Login Attempts Detected',
    'https://premyo-dev-ap-southeast-1.s3-ap-southeast-1.amazonaws.com/premyo/email/assets/lock.png',
    'Multiple Login Attempts Detected',
    `
            Our system has detected multiple login attempts on your Bonds.PH account
            <div class="message-line-break"></div>
            Please check the following information to make sure that this was you:
        `,
    `
        ${createFormValues(json)}
        `,
  );
}

export function createCashInCompleteTemplate(
  paymentChannel: string,
  json: Json,
): string {
  return createTemplate(
    'Cash In Complete',
    'https://premyo-dev-ap-southeast-1.s3-ap-southeast-1.amazonaws.com/premyo/email/assets/wallet.png',
    'Cash In Complete',
    `
            You've successfully added funds to your Bonds.PH wallet via ${paymentChannel}.
        `,
    `
        ${createFormValues(json)}
        `,
  );
}

export function createCompleteCashInTemplate(
  paymentChannel: string,
  json: Json,
  href: string,
): string {
  return createTemplate(
    'Complete Your Cash In',
    'https://premyo-dev-ap-southeast-1.s3-ap-southeast-1.amazonaws.com/premyo/email/assets/wallet.png',
    'Complete Your Cash In',
    `
            You're almost done! Please refer to the details below to complete your cash-in request.
        `,
    `
        ${createFormValues(json)}
        ${createSpacing()}
        ${createMessage(
          `To pay, simply click the button below. You'll be redirected to the payment portal of ${paymentChannel}`,
        )}.
        ${createSpacing()}
        ${createCTAContainer(createCTAButton('Pay Now', href))}
        `,
  );
}

export function createCompleteManualDepositTemplate(json: Json): string {
  return createTemplate(
    'Complete Your Cash In (via Bank Deposit)',
    'https://premyo-dev-ap-southeast-1.s3-ap-southeast-1.amazonaws.com/premyo/email/assets/wallet.png',
    'Complete Your Cash In',
    `
            You're almost done! Simply go to any branch to pay your total amount due using the following details:
        `,
    `
        ${createFormValues(json)}
        ${createSpacing()}
        ${createMessage(
          'Make sure to upload image of deposit slip as proof in the app.',
        )}.
        `,
  );
}

export function createCashInFailedTemplate(
  paymentChannel: string,
  json: Json,
): string {
  return createTemplate(
    'Cash In Failed',
    'https://premyo-dev-ap-southeast-1.s3-ap-southeast-1.amazonaws.com/premyo/email/assets/wallet.png',
    'Cash In Failed',
    `
            Your request to cash in via ${paymentChannel} for the following could not be completed.
        `,
    `
        ${createFormValues(json)}
        ${createSpacing()}
        ${createMessage(
          'To avoid this from happening again, please make sure to pay on time the total amount due.',
        )}.
        `,
  );
}

export function createDirectDepositCompleteCashInTemplate(
  cashInDetails: Json,
  cashInBankDetails: Json,
  userDetails: Json,
): string {
  return createTemplate(
    'Complete Your Cash In',
    'https://premyo-dev-ap-southeast-1.s3-ap-southeast-1.amazonaws.com/premyo/email/assets/wallet.png',
    'Complete Your Cash In',
    `
            You're almost done! Please refer to the details below to complete your cash-in request.
        `,
    `
        ${createFormValues(cashInDetails)}
        ${createSpacing()}
        ${createFormValues(cashInBankDetails)}

        ${createSpacing()}
        ${createMessage(
          'After the payment, please fill our this form to send us the copy of your proof of payment or deposit slip.',
        )}
        ${createSpacing()}
        ${createMessage(
          'Please make sure to select <span style="color: #0652dd">"Submit Deposit Slip"</span> as category and provide these additional details in the description box.',
        )}
        ${createSpacing()}

        ${createFormValues(userDetails)}
        ${createSpacing()}

        ${createMessage(
          '<strong>THIS CASH-IN REQUEST IS VALID ONLY FOR 72 HOURS.</strong>',
        )}
        `,
  );
}

export function createCashOutPendingTemplate(
  paymentChannel: string,
  cashOutDetails: Json,
): string {
  return createTemplate(
    'Cash Out Pending',
    'https://premyo-dev-ap-southeast-1.s3-ap-southeast-1.amazonaws.com/premyo/email/assets/wallet.png',
    'Cash Out Pending',
    `
            You've requested to cash out funds from your Bonds.PH wallet via ${paymentChannel} with the following details:
        `,
    `
            ${createFormValues(cashOutDetails)}
            ${createSpacing()}
            ${createMessage(
              'Please note that the transaction fee for your cash-out request will be deducted from your Bonds.PH wallet balance.',
            )}
        `,
  );
}

export function createCashOutCompletedTemplate(
  paymentChannel: string,
  cashOutDetails: Json,
) {
  return createTemplate(
    'Cash Out Completed',
    'https://premyo-dev-ap-southeast-1.s3-ap-southeast-1.amazonaws.com/premyo/email/assets/wallet.png',
    'Cash Out Completed',
    `
            You've successfully cashed out the following amount from your Bonds.PH wallet via ${paymentChannel}:
        `,
    `
            ${createFormValues(cashOutDetails)}
            ${createSpacing()}
            ${createMessage(
              'Please note that the transaction fee for your cash-out request was deducted from your Bonds.PH wallet balance in addition to cash-out amount.',
            )}
        `,
  );
}

export function createCashOutFailedTemplate(
  paymentChannel: string,
  cashOutDetails: Json,
) {
  return createTemplate(
    'Cash Out Failed',
    'https://premyo-dev-ap-southeast-1.s3-ap-southeast-1.amazonaws.com/premyo/email/assets/wallet.png',
    'Cash Out Failed',
    `
            Your cash-out request via ${paymentChannel} for the following could not be completed:
        `,
    `
            ${createFormValues(cashOutDetails)}
            ${createSpacing()}
            ${createMessage(
              'Please make sure to take note of the cash-out period allowed by your selected payment channel and to enter the correct bank account details',
            )}
        `,
  );
}

export function createKycInProgressTemplate(): string {
  return createTemplate(
    "You're Almost There",
    'https://premyo-dev-ap-southeast-1.s3-ap-southeast-1.amazonaws.com/premyo/email/assets/unverified.png',
    "You're Almost There",
    // `
    //         We're now checking your account verification request and will notify you via email within two (2) business days once we have completed the process.
    //     `,
    `
      <strong>Thank you for completing the account opening requirements. You will be notified via email within two (2) business days once we have completed the process.</strong>
    `,
  );
}

export function createKycSuccessfulTemplate(): string {
  return createTemplate(
    'Account Verification Successful',
    'https://premyo-dev-ap-southeast-1.s3-ap-southeast-1.amazonaws.com/premyo/email/assets/verified.png',
    'Account Verification Successful',
    `
            Great news! Your account has now been verified. Start buying bonds today.
        `,
  );
}

export function createKycRejectTemplate(remarks: any): string {
  return createTemplate(
    'Account Verification Unsuccessful',
    'https://premyo-dev-ap-southeast-1.s3-ap-southeast-1.amazonaws.com/premyo/email/assets/verified.png',
    'Account Verification Unsuccessful',
    `
            We regret to inform you that your Bonds.PH account verification was unsuccessful.
            <div class="spacer"></div>
            Please refer to the Customer Support Note below on how to proceed.
            <div class="spacer"></div>
            <div style="text-align: left;">
                <strong>Customer Support Note: </strong>
                <br/>
                ${remarks}
            </div>
            <div class="spacer"></div>
            <div class="spacer"></div>
            <div class="spacer"></div>
            For successful verification, please make sure that all of the information you submit is up-to-date and accurate and the documents are valid and captured clearly.
        `,
  );
}

export function createPutToDraftKycTemplate(
  fields: string[],
  remarks: string,
): string {
  const message = `
    <div style="text-align: left">
    We've noticed some inconsistencies in your verification application.
    <div class="spacer"></div>
    Please update the information and/or documents you provided, so we can proceed your verification.
    <ul style="padding: 0">
      ${fields.map(name => `<li>${name}</li>`).join('')}
    </ul> 
    <div class="spacer"></div>
    <strong>Customer Support Note:</strong><br/>
    ${remarks}
    <br/><br/>
    For successful verification, please make sure that all of the information you submitted is up-to-date and accurate, and the documents are valid, legible, and not expired.
    </div>
  `;
  return createTemplate(
    'Update Your Information',
    'https://premyo-dev-ap-southeast-1.s3-ap-southeast-1.amazonaws.com/premyo/email/assets/verified.png',
    'Update Your Information',
    message,
  );
}

export function adminPasswordReset(passwordGenerated: string): string {
  return createAdminEmailTemplate(
    '',
    'https://premyo-dev-ap-southeast-1.s3-ap-southeast-1.amazonaws.com/premyo/email/assets/lock.png',
    'Password Reset',
    `
            Your password has been reset by the admin.
            <div class="spacer"></div>
            
        `,
    `${createFormValues({
      'Generated Password': passwordGenerated,
    })}`,
  );
}

export function admin2FaReset(): string {
  return createAdminEmailTemplate(
    '',
    'https://premyo-dev-ap-southeast-1.s3-ap-southeast-1.amazonaws.com/premyo/email/assets/lock.png',
    '2FA Reset',
    `
            Your 2FA has been reset by the admin. <br/>
            Kindly login to the Bonds.PH Admin to set up your 2FA.
        `,
  );
}

export function adminChangeRole({
  prevRole,
  newRole,
  prevAccess,
  newAccess,
}): string {
  // add admin role map
  return createAdminEmailTemplate(
    '',
    'https://premyo-dev-ap-southeast-1.s3-ap-southeast-1.amazonaws.com/premyo/email/assets/lock.png',
    'Access Changed',
    `
            Your access for Bonds.PH Admin has been changed. <br/>
            <div class="spacer"></div>
        `,
    `${createFormValues({
      'Previous Access': prevRole,
      'New Access': newRole,
    })}`,
  );
}
export function adminChangeAccessLevel(
  prevAccess: number,
  newAccess: number,
): string {
  // add admin role map
  return createAdminEmailTemplate(
    '',
    'https://premyo-dev-ap-southeast-1.s3-ap-southeast-1.amazonaws.com/premyo/email/assets/lock.png',
    'Access Changed',
    `
            Your access for admin of Bonds.PH has been changed. <br/>
            <div class="spacer"></div>
            ${createFormValues({
              'Previous Access Level': prevAccess,
              'New Access Level': newAccess,
            })}
        `,
  );
}
export function adminAccountDisabled(): string {
  return createAdminEmailTemplate(
    '',
    'https://premyo-dev-ap-southeast-1.s3-ap-southeast-1.amazonaws.com/premyo/email/assets/lock.png',
    'Account Disabled',
    'Your account for Bonds.PH Admin has been disabled by the Admin Manager.',
  );
}
export function adminAccountEnabled(role: string): string {
  // add admin role map
  return createAdminEmailTemplate(
    '',
    'https://premyo-dev-ap-southeast-1.s3-ap-southeast-1.amazonaws.com/premyo/email/assets/lock.png',
    'Account Enabled',
    `
            Your account for Bonds.PH Admin was enabled by the Admin Manager. <br/>
            <div class="spacer"></div>
        `,
    `${createFormValues({
      'Access Type': role,
    })}`,
  );
}
export function adminAccountCreated(data: Json): string {
  // add admin role map
  return createAdminEmailTemplate(
    '',
    'https://premyo-dev-ap-southeast-1.s3-ap-southeast-1.amazonaws.com/premyo/email/assets/lock.png',
    'Account Created',
    `
            This is your account for Bonds.PH Admin <br/>
            <div class="spacer"></div>
        `,
    `${createFormValues({
      Email: data.email,
      Password: data.password,
      'Access Type': data.role,
    })}
    <div class="spacer"></div>
    <div class="template-message">Don’t forget to change your password once you’ve logged in.</div>
    `,
  );
}

export function emailOtp(otp: string): string {
  return createTemplate(
    '',
    'https://premyo-dev-ap-southeast-1.s3-ap-southeast-1.amazonaws.com/premyo/email/assets/lock.png',
    'One-Time Password',
    `Your Bonds.PH One-Time Password is generated. <br/>Do not share this code to anyone. <br/><h1><b>${otp}</b></h1>`,
  );
}
