// server/src/types/ride.ts
export type RideStatus = 'recording' | 'completed' | 'canceled';

export type RideRow = {
  ride_id: string;           // uuid
  user_id: string;           // uuid (FK vers users.user_id)
  status: RideStatus;        // check constraint en DB
  started_at: string;        // timestamptz -> ISO string
  ended_at: string | null;   // timestamptz -> ISO string | null
  start_lat: number;         // double precision
  start_lng: number;         // double precision
  end_lat: number | null;    // double precision | null
  end_lng: number | null;    // double precision | null
  distance_meters: number;   // double precision
  duration_seconds: number | null; // GENERATED ALWAYS AS (...) STORED
  path_polyline: string | null;    // text | null
  created_at: string;        // timestamptz -> ISO string
};

//JOIN users pour enrichir la carte
export type RideDTO = RideRow & {
  name: string | null;         // users.name
  car_image_url: string | null;// users.car_image_url
};
