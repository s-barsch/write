
    newText() {
        const ts = date.timestamp();
        const path = date.makePath(ts);
        //let d = new Date
        return {
            id:   ts,
            path: path,
            body: "",
            mod:  new Date().getTime()
        }
    }

