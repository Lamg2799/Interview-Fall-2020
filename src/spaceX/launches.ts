import moment from 'moment';
import fetch from 'node-fetch';

export interface ILaunch {
  flight_number?: number;
  mission_name?: string;
  start?: string;
  end?: string;
  rocket_name?: string;
  rocket_type?: string;
  details?: string;
  launch_success?: boolean;
  error?: string;
}

export class Launches {
  url = 'https://api.spacexdata.com/v3/launches';

  /**
   * Gets the daily spaceX launches
   * @param date string with YYYY format
   */
  public async getLaunchesByYear(year: string): Promise<ILaunch[]> {
    try {
      // Get the date as a moment object
      const dateAsMoment = moment(year, 'YYYY');
      // Check that the date string is valid, and that the date is before or equal to today's date
      // moment() creates a moment with today's date
      if (!dateAsMoment.isValid() || !dateAsMoment.isSameOrBefore(moment())) {
        return [{ error: 'invalid year' }];
      }
      // Get the parsed request
      const parsed = await this.requestLaunchesByYear(year);
      // Maps and creates the return list
      return this.filterFields(parsed);
    } catch (e) {
      console.log(e);
      return [
        {
          error: `There was an error retrieving this launch`,
        },
      ];
    }
  }

  /**
   * Gets the daily spaceX launches
   * @param date string with YYYY format
   */
  public async getLaunchesByStartAndEnd(start: string, end: string): Promise<ILaunch[]> {
    try {
      // Get the date as a moment object
      const startDate = moment(start, 'YYYY-mm-dd');
      const endDate = moment(end, 'YYYY-mm-dd');
      // Check that the date string is valid, and that the date is before or equal to today's date
      // moment() creates a moment with today's date
      if (!startDate.isValid() || !startDate.isSameOrBefore(endDate)) {
        return [{ error: 'invalid years selected' }];
      }
      // Get the parsed request
      const parsed = await this.requestLaunchesByStartAndEnd(start, end);
      // Maps and creates the return list
      return this.filterFields(parsed);
    } catch (e) {
      console.log(e);
      return [
        {
          error: `There was an error retrieving these launches`,
        },
      ];
    }
  }

  /**
   * Makes the api request for launches per year
   * @param year
   */
  async requestLaunchesByYear(year: string): Promise<any[]> {
    const res = await fetch(`${this.url}?launch_year=${year}`);
    return res.json();
  }

  async requestLaunchesByStartAndEnd(start: string, end: string): Promise<any[]> {
    const res = await fetch(`${this.url}?start=` + start + `&end=` + end);
    return res.json();
  }

  /**
   * Helpers
   */

  /**
   * Filters out desired fields
   * @param data
   */
  filterFields(data: any[]) {
    return data.map((p) => ({
      flight_number: p.flight_number,
      mission_name: p.mission_name,
      start: p.start,
      end: p.end,
      rocket_name: p.rocket?.rocket_name,
      rocket_type: p.rocket?.rocket_type,
      details: p.details,
      launch_success: p.launch_success,
    }));
  }
}
