
import { Designation } from "./designation";
import { Location } from "./location";
import { Project } from "./project";
import { SkillSet } from "./skillset";
import { TechRole } from "./techrole";
export class UserInfo {
  id: string;
  firstName: string;
  middleName: string;
  lastName: string;
  email: string;
  empId: string;
  gender: string;
  designation: Designation;
  mobileNo: string;
  location: Location;
  techRoles: TechRole[];
  projects: Project[];
  skillSets: SkillSet[]; 
}