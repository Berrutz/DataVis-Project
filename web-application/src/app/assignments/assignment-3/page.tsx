import AssignmentPage from "../_components/assignment-page"
import { assignmentsData } from "../_data/assignment-data";

const assMetadata = assignmentsData.filter((ass) => ass.name === "Assignment 3").at(0);

export default function Assignment3() {
    return (<AssignmentPage
        title={assMetadata!.name}
        shortDescription={assMetadata!.shortDescription}>
    </AssignmentPage>
    )
}