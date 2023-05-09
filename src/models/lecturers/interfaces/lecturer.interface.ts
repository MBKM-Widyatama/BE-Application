import { MaritalStatusEnumeraton, SexEnumeration } from 'src/libraries/common';

export interface ICreateLecturer {
  faculty_id: string;
  name: string;
  nrk: number;
  nidn: number;
  profile_picture: string;
  sex: SexEnumeration;
  marital_status: MaritalStatusEnumeraton;
}
