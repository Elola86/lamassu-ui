import { apiRequest, queryParametersToURL } from "ducks/services/api";
import * as models from "./models";
import { ListResponse, QueryParameters } from "ducks/models";

export const getStats = async (): Promise<models.CAStats> => {
    return apiRequest({
        method: "GET",
        url: window._env_.LAMASSU_CA_API + "/v1/stats"
    }) as Promise<models.CAStats>;
};

export const getEngines = async (): Promise<models.CryptoEngine[]> => {
    return apiRequest({
        method: "GET",
        url: window._env_.LAMASSU_CA_API + "/v1/engines"
    }) as Promise<models.CryptoEngine[]>;
};

export const getCAs = async (params: QueryParameters): Promise<ListResponse<models.CertificateAuthority>> => {
    return apiRequest({
        method: "GET",
        url: `${window._env_.LAMASSU_CA_API}/v1/cas${queryParametersToURL(params)}`
    }) as Promise<ListResponse<models.CertificateAuthority>>;
};

export const getCA = async (caID: string): Promise<models.CertificateAuthority> => {
    return apiRequest({
        method: "GET",
        url: `${window._env_.LAMASSU_CA_API}/v1/cas/${caID}`
    }) as Promise<models.CertificateAuthority>;
};

export const getIssuedCertificatesByCA = async (caID: string): Promise<ListResponse<models.Certificate>> => {
    return apiRequest({
        method: "GET",
        url: `${window._env_.LAMASSU_CA_API}/v1/cas/${caID}/certificates`
    }) as Promise<ListResponse<models.Certificate>>;
};

export const getCertificate = async (sn: string): Promise<models.Certificate> => {
    return apiRequest({
        method: "GET",
        url: `${window._env_.LAMASSU_CA_API}/v1/certificates/${sn}`
    }) as Promise<models.Certificate>;
};

export const createCA = async (payload: models.CreateCAPayload): Promise<models.CertificateAuthority> => {
    return apiRequest({
        method: "POST",
        url: `${window._env_.LAMASSU_CA_API}/v1/cas`,
        data: payload
    }) as Promise<models.CertificateAuthority>;
};

export const importCA = async (id: string, engineID: string, certificateB64: string, privKeyB64: string, expiration: models.ExpirationFormat): Promise<models.CertificateAuthority> => {
    return apiRequest({
        method: "POST",
        url: `${window._env_.LAMASSU_CA_API}/v1/cas/import`,
        data: {
            id: id,
            engine_id: engineID,
            private_key: privKeyB64,
            ca: certificateB64,
            ca_chain: [],
            ca_type: "IMPORTED",
            issuance_expiration: expiration
        }
    });
};

export const importReadOnlyCA = async (id: string, certificateB64: string): Promise<models.CertificateAuthority> => {
    return apiRequest({
        method: "POST",
        url: `${window._env_.LAMASSU_CA_API}/v1/cas/import`,
        data: {
            id: id,
            ca: certificateB64,
            ca_chain: [],
            ca_type: "EXTERNAL"
        }
    });
};

export const updateCAMetadata = async (caName: string, metadata: any): Promise<models.CertificateAuthority> => {
    return apiRequest({
        method: "PUT",
        url: `${window._env_.LAMASSU_CA_API}/v1/cas/${caName}/metadata`,
        data: {
            metadata: metadata
        }
    });
};

export const updateCertificateMetadata = async (certSN: string, metadata: any): Promise<models.Certificate> => {
    return apiRequest({
        method: "PUT",
        url: `${window._env_.LAMASSU_CA_API}/v1/certificates/${certSN}/metadata`,
        data: {
            metadata: metadata
        }
    });
};

export const signPayload = async (caName: string, message: string, messageType: string, algorithm: string): Promise<models.SignPayloadResponse> => {
    return apiRequest({
        method: "POST",
        url: window._env_.LAMASSU_CA_API + "/v1/cas/" + caName + "/signature/sign",
        data: {
            message: message,
            message_type: messageType,
            signing_algorithm: algorithm
        }
    });
};

export const verifyPayload = async (caName: string, signature: string, message: string, messageType: string, algorithm: string): Promise<models.VerifyPayloadResponse> => {
    return apiRequest({
        method: "POST",
        url: window._env_.LAMASSU_CA_API + "/v1/ca/" + caName + "/signature/verify",
        data: {
            signature: signature,
            message: message,
            message_type: messageType,
            signing_algorithm: algorithm
        }
    });
};

export const signCertificateRequest = async (caName: string, csr: string): Promise<models.Certificate> => {
    return apiRequest({
        method: "POST",
        url: window._env_.LAMASSU_CA_API + "/v1/cas/" + caName + "/certificates/sign",
        data: {
            csr: csr,
            sign_verbatim: true
        }
    });
};

export const updateCertificateStatus = async (certSerial: string, status: models.CertificateStatus, revocationReason?: string): Promise<models.Certificate> => {
    const body: any = {
        status: status
    };

    if (body.status === models.CertificateStatus.Revoked) {
        body.revocation_reason = revocationReason;
    }
    return apiRequest({
        method: "PUT",
        url: `${window._env_.LAMASSU_CA_API}/v1/certificates/${certSerial}/status`,
        data: body
    });
};

export const updateCAStatus = async (caID: string, status: models.CertificateStatus, revocationReason?: string): Promise<models.CertificateAuthority> => {
    const body: any = {
        status: status
    };

    if (body.status === models.CertificateStatus.Revoked) {
        body.revocation_reason = revocationReason;
    }

    return apiRequest({
        method: "POST",
        url: `${window._env_.LAMASSU_CA_API}/v1/cas/${caID}/status`,
        data: body
    });
};
