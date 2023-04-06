import { SingleTextForm } from "@/components/inputForms";
import {Layout, updateName} from "@/components/layout";


export default function NameChangeForm() {
    return (
        <Layout>
            <SingleTextForm label="Enter your new name" outputHandler={updateName}/>
        </Layout>
    );
}