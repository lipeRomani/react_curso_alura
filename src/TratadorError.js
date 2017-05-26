import PubSub from "pubsub-js";

export default class TratadorError 
{
    errorPublish(errors) 
    {
        errors.forEach((err) => {
           new PubSub.publish('form-error', err);
        });
    }
}