interface IDevelopers {
    id: number,
    name: string,
    email: string,
};

type TDeveloper = Omit<IDevelopers, "id">;

interface IDeveloperInfo {
    devId: number,
    devName: string,
    devEmail: string,
    infoSince?: Date | null,
    infoPreferred?: string | null,
};

interface IInfoDevelopers {
    id: number,
    developerId?: number,
    developerSince: Date,
    preferredOS: string,
};

interface IProject {
    name: string,
    description: string,
    estimatedTime: string,
    repository: string,
    startDate: Date,
    endDate: Date,
    developerId: number,
    id: number,
};


interface IProjectTechnology {
    projId: number;
    projName: string;
    projDescription: string;
    projEstimatedTime: string;
    projRepository: string;
    projStartDate: Date;
    projEndDate: Date | null;
    projDeveloperId: number;
    techId: number | null;
    techName: string | null;
}; 

export { IDevelopers, TDeveloper, IDeveloperInfo, IInfoDevelopers, IProject, IProjectTechnology };