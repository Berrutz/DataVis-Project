
import AssignmentPage from "../_components/assignment-page"
import { assignmentsData } from "../_data/assignment-data";

const assMetadata = assignmentsData.filter((ass) => ass.name === "Assignment 4").at(0);

export default function Assignment4() {
    return (<AssignmentPage
        title={assMetadata!.name}
        shortDescription={assMetadata!.shortDescription}>
    </AssignmentPage>
    )
}
