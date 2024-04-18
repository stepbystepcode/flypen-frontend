import {api} from 'src/boot/axios'
import {LocalStorage} from "quasar";

export default function commandReq(com,params1,params2) {
  return api.post('/api/file/commands',{
      command: com.toString(),
      params: [params1,params2]
    },{
      headers:{
        'Authorization': `Bearer ${LocalStorage.getItem('token')}`,
        'Content-Type': 'application/json'
      }
    }
  )
}
