//http://localhost:3030

export const login = async ()=> {
    const url = '/api/login';
    // const user_data = JSON.stringify({email:'wrong@email.com',password:'qwerty'})
    const user_data = JSON.stringify({email:'baraba@acum.com',password:'qwerty'})
    const headers = {'Content-Type': 'application/json'}
    const options = {method:'POST',body:user_data,headers}
    const response = await (await fetch(url,options)).json()
    console.log({response})
    return response;
}
export const logout = async ()=> {
    const url = '/api/logout';
    const response = await (await fetch(url)).json()
    console.log({response})
    return response;
}
export const get_protected = async ()=> {
    const url = '/api/protected';
    const response = await (await fetch(url)).json()
    console.log({response})
    return response;
}