export const getInitials = (fullString: string, delimiter: string, maxCount: number) => {
    let names = fullString.split(delimiter).slice(0, maxCount);
    let initials = names[0].substring(0, 1).toUpperCase();
    for(let i = 1; i < names.length; i++) {
        initials += names[i].substring(0, 1).toUpperCase();
    }
    return initials;
};

export const checkValidateEmail = (email) => {
	//const re = /^(([^<>()[]\.,;:\s@"]+(.[^<>()[]\.,;:\s@"]+)*)|(".+"))@(([[0-9]{1,3}.[0-9]{1,3}.[0-9]{1,3}.[0-9]{1,3}])|(([a-zA-Z-0-9]+.)+[a-zA-Z]{2,}))$/;
	//return re.test(String(email).toLowerCase());
	var re = /\S+@\S+\.\S+/;
	return re.test(email);
};

export const stripTimeInDateRange = (range: any) => {
    const filterDate = range;
    if (filterDate && filterDate.length > 0) {
        let start = filterDate[0].format("YYYY-MM-DD");
        let end = filterDate[1].format("YYYY-MM-DD");
        return [start, end];
    }
    return false;
};

export const dotTocomma = (numberString :any) =>{
   return numberString.replace(/\./g, ',');
}