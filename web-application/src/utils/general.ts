const BASE_PATH = "/DataVis-Project";
export const getStaticFile = (path: string) => {
    return path.startsWith("/") ? BASE_PATH + path : BASE_PATH + "/" + path;
};
