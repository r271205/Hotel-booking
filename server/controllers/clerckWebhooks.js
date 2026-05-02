import User from '../models/User.js'   
import { Webhook } from 'svix'


const clerkWebhooks = async (req, res) => {
    try {
        console.log("Webhook hit")
        //create a svix instance with clerk webhook secret.
        const whook = new Webhook(process.env.CLERK_WEBHOOK_SECRET)

        if (!whook) {
            return res.status(500).json({ message: "Missing webhook secret" });
        }

        //getting headers
        const headers = {
            "svix-id": req.headers["svix-id"],
            "svix-timestamp": req.headers["svix-timestamp"],
            "svix-signature": req.headers["svix-signature"],
        };

        //verifying headers
        await whook.verify(req.rawBody, headers)
        console.log("Verification passed");

        //getting data from request body
        const {data, type} = req.body

        
        console.log("Event type:", type);
        //switch cases for different events
        switch (type) {
            case "user.created":{
                const userData = {
            _id: data.id,
            email: data.email_addresses[0].email_address,
            userName: data.first_name + " " + data.last_name,
            image: data.image_url,
        }
                await User.create(userData);
                break;
            }
            case "user.updated":{
                 const userData = {
                    _id: data.id,
                    email: data.email_addresses[0].email_address,
                    userName: data.first_name + " " + data.last_name,
                    image: data.image_url
                }
                await User.findByIdAndUpdate(data.id, userData);
                break;
            }
            case "user.deleted":{
                await User.findByIdAndDelete(data.id);
                break;
            }
        
            default:
                break;
        }
        res.json({success:true, message:"Webhook Recieved"})

    } catch (error) {
        console.log(error.message);
        res.json({success:false, message: error.message})
        
    }
}

export default clerkWebhooks