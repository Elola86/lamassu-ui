import { ListResponse, QueryParameters } from "ducks/models";
import { apiRequest, queryParametersToURL } from "ducks/services/api";
import { CreateUpdateDMSPayload, DMS, DMSStats } from "./models";

export const getStats = async (): Promise<DMSStats> => {
    return apiRequest({
        method: "GET",
        url: window._env_.LAMASSU_DMS_MANAGER_API + "/v1/stats"
    }) as Promise<DMSStats>;
};

export const getDMSs = async (params: QueryParameters): Promise<ListResponse<DMS>> => {
    return apiRequest({
        method: "GET",
        url: `${window._env_.LAMASSU_DMS_MANAGER_API}/v1/dms${queryParametersToURL(params)}`
    }) as Promise<ListResponse<DMS>>;
};

export const getDMSByID = async (id: string): Promise<DMS> => {
    return apiRequest({
        method: "GET",
        url: `${window._env_.LAMASSU_DMS_MANAGER_API}/v1/dms/${id}`
    }) as Promise<DMS>;
};

export const createDMS = async (payload: CreateUpdateDMSPayload): Promise<DMS> => {
    return apiRequest({
        method: "POST",
        url: `${window._env_.LAMASSU_DMS_MANAGER_API}/v1/dms`,
        data: payload
    }) as Promise<DMS>;
};

export const updateDMS = async (id: string, payload: CreateUpdateDMSPayload): Promise<DMS> => {
    return apiRequest({
        method: "PUT",
        url: `${window._env_.LAMASSU_DMS_MANAGER_API}/v1/dms/${id}`,
        data: payload
    }) as Promise<DMS>;
};
