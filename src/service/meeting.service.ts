import axios from "axios";
class MeetingServices {
     public async CreateMeeting(token: string) {
          const data = await axios.post(
               `${process.env.VIDEO_SDK_API_URL}/v2/rooms`,
               {},
               {
                    headers: {
                         Authorization: token,
                    },
               }
          );
          return await data.data;
     }
     public async ValidateMeeting(roomId: string, token: string) {
          const data = await axios.post(
               `${process.env.VIDEO_SDK_API_URL}/v2/rooms/validate/${roomId}`,
               {},
               {
                    headers: {
                         Authorization: token,
                    },
               }
          );
          return await data.data;
     }

     public async GetSingleMeeting(token: string, roomId: string) {
          const data = await axios.get(`${process.env.VIDEO_SDK_API_URL}/v2/rooms/${roomId}`, {
               headers: {
                    Authorization: token,
               },
          });
          return await data.data;
     }
}

const MeetingService = new MeetingServices();
export { MeetingService };
