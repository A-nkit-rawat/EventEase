module.exports=  function generateEventId(date) {
    const monthNames = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN',
                        'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];
    const month=monthNames[date.getMonth()];
    const year=date.getFullYear().toString();
    const randomPart=Math.random().toString(36).substr(2, 3).toUpperCase();
    return `EVT-${month}-${year}-${randomPart}`;
}