// @flow

import DataLoader from 'dataloader';
import nextbus from 'nextbus';

import type {
  Agency as NBAgency,
  Route as NBRoute,
  RouteConfig as NBRouteConfig,
} from 'nextbus';

export type Agency = NBAgency;

export type Route = NBRoute & {
  agencyTag: string,
};

export type RouteConfig = NBRouteConfig & {
  agencyTag: string,
};

const nb = nextbus({
  onRequest(uri) {
    console.info('Request to NextBus:', uri);
  },
});

export default function () {
  const agencyLoader = new DataLoader(async (agencyTags: string[]): Promise<Agency[]> => {
    const agencies = await nb.getAgencies();
    return agencyTags.map(
      tag => (
        agencies.find(agency => agency.tag === tag) ||
        new Error(`No agency with tag: "${tag}"`)
      )
    );
  });
  const routeLoader = new DataLoader(
    (agencyTags: string[]): Promise<Array<Route[]>> => Promise.all(agencyTags.map(
      async (agencyTag) => {
        const routes = await nb.getRoutes(agencyTag);
        return routes.map(route => ({ ...route, agencyTag }));
      }
    ))
  );
  const routeConfigLoader = new DataLoader((compositeKeys: string[]) => Promise.all(
    compositeKeys.map(async (compositeKey: string) => {
      const [agencyTag, routeTag] = compositeKey.split(':');
      return { ...(await nb.getRoute(agencyTag, routeTag)), agencyTag };
    })
  ));
  return {
    async getAgencies(): Promise<Agency[]> {
      const agencies = await nb.getAgencies();
      for (const agency of agencies) {
        agencyLoader.prime(agency.tag, agency);
      }
      return agencies;
    },
    getAgency(tag: string): Promise<Agency> {
      return agencyLoader.load(tag);
    },
    getRoutes(agencyTag: string): Promise<Route[]> {
      return routeLoader.load(agencyTag);
    },
    getRoute(agencyTag: string, routeTag: string): Promise<RouteConfig> {
      return routeConfigLoader.load(`${agencyTag}:${routeTag}`);
    },
  };
}
