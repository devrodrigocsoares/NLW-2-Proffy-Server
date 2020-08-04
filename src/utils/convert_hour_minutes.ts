export default function convert_hour_minutes(time:string){

    const [hour, minutes] = time.split(':').map(Number);
    const timeInminutes = (hour * 60) + minutes;
    return timeInminutes;
}