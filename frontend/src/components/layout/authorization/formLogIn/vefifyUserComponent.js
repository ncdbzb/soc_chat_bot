import { useEffect } from "react";
import { useVerifyUserQuery } from "../../../store/services/auth";


function VerifyUserComponent({ token, setIsPopupOpen, setMessage}){
    const {data,  status, error , isLoading } = useVerifyUserQuery(token);

    console.log(data, status, error, isLoading)
    useEffect(() => {
        // Обработка результата запроса
        if (status === "fulfilled") {
            console.log('fulfiled')
            setIsPopupOpen(true);
            setMessage("Верификация прошла успешно!");
        } 
        if (error) {
            console.log(error)
            setIsPopupOpen(true);
            setMessage("Верификация не прошла успешно!");
        }
    }, [status, error]);

    return null; // Показываем загрузку, если идет запрос

};
export default VerifyUserComponent;