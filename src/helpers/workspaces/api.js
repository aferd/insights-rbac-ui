import axios from 'axios';
import { responseDataInterceptor, interceptor500, errorInterceptor } from '@redhat-cloud-services/frontend-components-utilities/interceptors';

import getWorkspace from '@redhat-cloud-services/rbac-client/dist/v2/WorkspacesRead';
import createWorkspace from '@redhat-cloud-services/rbac-client/dist/v2/WorkspacesCreate';
import updateWorkspace from '@redhat-cloud-services/rbac-client/dist/v2/WorkspacesPatch';
import deleteWorkspace from '@redhat-cloud-services/rbac-client/dist/v2/WorkspacesDelete';
// import listWorkspaces from '@redhat-cloud-services/rbac-client/dist/v2/WorkspacesList';
import { APIFactory } from '@redhat-cloud-services/javascript-clients-shared';

import { RBAC_API_BASE_2 } from '../../utilities/constants';

// TODO: remove once workspaces endpoints are implemented
const interceptor404 = (error) => {
  if (error.response && error.response.status === 404) {
    return Promise.resolve({});
  }
};

const axiosInstance = axios.create();

axiosInstance.interceptors.response.use(null, interceptor404);

axiosInstance.interceptors.response.use(responseDataInterceptor);
axiosInstance.interceptors.response.use(null, interceptor500);
axiosInstance.interceptors.response.use(null, errorInterceptor);

const workspacesApi = new APIFactory(
  RBAC_API_BASE_2,
  {
    getWorkspace: async (...args) => {
      const getWs = await getWorkspace(...args);
      return {
        ...getWs,
        options: {
          ...getWs.options,
          transformResponse: () => {
            return {
              // TODO: return normal data
            };
          },
        },
      };
    },
    createWorkspace: async (...args) => {
      const createWs = await createWorkspace(...args);
      return {
        ...createWs,
        options: {
          ...createWs.options,
          transformResponse: () => {
            return {
              // TODO: return normal data
            };
          },
        },
      };
    },
    updateWorkspace: async (...args) => {
      const updateWs = await updateWorkspace(...args);
      return {
        ...updateWs,
        options: {
          ...updateWs.options,
          transformResponse: () => {
            return {
              // TODO: return normal data
            };
          },
        },
      };
    },
    deleteWorkspace: async (...args) => {
      const deleteWs = await deleteWorkspace(...args);
      return {
        ...deleteWs,
        options: {
          ...deleteWs.options,
          transformResponse: () => {
            return {
              // TODO: return normal data
            };
          },
        },
      };
    },
    listWorkspaces: () => {
      return {
        urlObj: {
          pathname: '/workspaces',
          search: '',
          hash: '',
        },
        options: {
          transformResponse: () => {
            return {
              // TODO: return normal data
              data: [],
              meta: {},
            };
          },
        },
      };
    },
  },
  { axios: axiosInstance }
);

export function getWorkspacesApi() {
  return workspacesApi;
}
