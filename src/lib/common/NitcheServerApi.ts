
export class NitcheServerApi {

  static async getBroadcastList() {
    const response = await fetch("http://localhost:8080/api/broadcasts")
    return await response.json()
  }

}