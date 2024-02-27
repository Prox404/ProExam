import {useSearchParams} from "react-router-dom";

function CodeExam() {

    const [params] = useSearchParams();
    console.log(params.get('keyCode'))

    return <>

    </>
}

export default CodeExam