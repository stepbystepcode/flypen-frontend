import axios from 'axios'
import {LocalStorage} from "quasar";

export default function commandReq(com,params1,params2) {
  return axios.post('http://8.130.101.128:8081/api/file/commands',{
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
