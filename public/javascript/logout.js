async function logout() {
    const response = await fetch('/api/users/logout',{
        method: 'post',
        headers: { 'Content-Type': }
    })
}