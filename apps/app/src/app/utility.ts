import {
  StandardResponse,
  ResponseStatus
} from '@sso-portal/store/types/api-response'
export const BaseEndpoint = 'orchestrator/api/v1/landingpageorch'

const OriginHost = {
  sctui: {
    origin: 'https://gcnweb-ftr.cdigital-development.mesouth1.bankfab.com',
    api: 'https://gcnweb-newui.cdigital-development.mesouth1.bankfab.com'
  },
  sct: {
    origin: 'https://gcnweb-newui.cdigital-development.mesouth1.bankfab.com',
    api: 'https://gcnweb-newui.cdigital-development.mesouth1.bankfab.com'
  },
  mct: {
    origin: 'https://gcnweb.cdigital-development.mesouth1.bankfab.com',
    api: 'https://apis-sct-mct.cdigital-development.mesouth1.bankfab.com/mct'
  },
  cert: {
    origin: 'https://gcnweb-cert.bankfab.com',
    api: 'https://gcnweb-cert.bankfab.com/cert'
  },
  certTest: {
    origin: 'https://gcnweb.cdigital-cert-test.mesouth1.bankfab.com',
    api: 'https://gcnweb.cdigital-cert-test.mesouth1.bankfab.com/cert'
  },
  prod: {
    origin: 'https://fabeconnect.bankfab.com',
    api: 'https://fabeconnect.bankfab.com/prod'
  },
  prodEaccess: {
    origin: 'https://fabeaccess.bankfab.com',
    api: 'https://fabeaccess.bankfab.com/prod'
  }
}

export const AuthEndpoint = {
  VALIDATE_USER_CREDENTIAL: `validateusercredentials`,
  VALIDATE_USER_STATIC_DATA: `validateuserstaticdata`,
  VALIDATE_MFA_TOKEN: `validatemfatoken`,
  RESEND_OTP: `otp`,
  SET_PASSWORD: `setpassword`
}

export const DashboardEndpoint = {
  GET_LOGIN_DETAILS: `getLoginDetails`,
  GET_LOGIN_HISTORY: `getLoginHistory`,
  GET_ENTITLEMENTS: `getMenuEntitlements`,
  GET_EXCHANGE_RATES: `getExchangeRate`,
  NOTIFY_SSO: `notifySSORequest`,
  GET_SESSION_ALIVE: `gcnSessionKeepAlive`,
  LOGOUT: `notifyLogout`,
  GET_SSO_URL: `getSSOURL`,
  GET_TERMS_AND_CONDITIONS: `getTermsAndConditions`,
  PROCESS_TERMS_AND_CONDITIONS: `processTermsAndConditions`,
  VALIDATE_SESSION: `validateSession`,
  FETCH_IMPORTANT_UPDATES: `fetchStaticMessages`,
  FETCH_PROFILE_SUMMARY: `fetchProfileSummary`,
  UPDATE_MANAGE_PROFILE: `manageProfile`
}

export const getAPiUrl = (): string => {
  let apiUrl = ''

  if (typeof window !== 'undefined') {
    const origin = window.location.origin
    switch (origin) {
      case OriginHost.sctui.origin:
        apiUrl = OriginHost.sctui.api
        break
      case OriginHost.sct.origin:
        apiUrl = OriginHost.sct.api
        break
      case OriginHost.mct.origin:
        apiUrl = OriginHost.mct.api
        break
      case OriginHost.cert.origin:
        apiUrl = OriginHost.cert.api
        break
      case OriginHost.certTest.origin:
        apiUrl = OriginHost.certTest.api
        break
      case OriginHost.prod.origin:
        apiUrl = OriginHost.prod.api
        break
      case OriginHost.prodEaccess.origin:
        apiUrl = OriginHost.prodEaccess.api
        break
      default:
        apiUrl = process.env.apiUrl
    }
  }

  return apiUrl
}

export async function handleResponse(promise) {
  promise.catch((err) => {
    console.log(err)
  })
  try {
    const response: StandardResponse = await promise
    if (!response.data) {
      throw 'Response is malformed'
    }

    const { data, status, message } = response.data

    // Axios does not seem to consistently catch errors itself
    // So this is a final check to see if a malformed status is here
    if (
      status !== ResponseStatus.Success &&
      status !== ResponseStatus.Fail &&
      status !== ResponseStatus.Failure
    ) {
      throw {
        data: data,
        status: status,
        message: message || 'An unknown error occurred'
      }
    }
    return {
      data,
      status,
      message
    }
  } catch (e) {
    return {
      status: ResponseStatus.Error,
      data: e.data,
      message: e.message.toString()
    }
  }
}

export const closeOpenChannels = (openChannels) => {
  if (openChannels && openChannels.length > 0) {
    openChannels.forEach((channel) => {
      const newWindow = window.open(null, channel)
      newWindow.close()
    })
  }
}

export const getMeta = (metaName) => {
  if (typeof window !== 'undefined') {
    const metas = document.getElementsByTagName('meta')

    for (let i = 0; i < metas.length; i++) {
      if (metas[i].getAttribute('name') === metaName) {
        return metas[i].getAttribute('content')
      }
    }
  }

  return ''
}
