/*
export default function saveToRemote(state: State, t: Text): State {
}
    saveToRemote(t: Text, callback: () => void) {
        fetch("/api/text/" + t.id + ".txt", {
            method: "PUT",
            body: t.body
        }).then(
            response => {
                const texts = [t].concat(this.state.Texts.slice());
                this.setState({ Texts: texts });
                console.log(response);
                callback();
            }
        )
            .catch(
                error => alert(error)
            );
    }
    saveToLocals(t: Text, callback: () => void) {
        let locals = this.state.Locals.slice();
        let replaced = false
        locals.forEach(function(e, i) {
            if (e.id == t.id) {
                locals[i] = t
                replaced = true
            }
        })
        if (!replaced) {
            locals = [t].concat(locals)
        }
        try {
            saveLocals(locals);
            console.log("saved locally");
        } catch(e) {
            alert(e);
            return;
        }
        callback();
    }

    removeFromTexts(t: Text) {
        const texts = this.state.Texts.filter(function(el) {
            console.log("removed from texts");
            return t.id != el.id
        });
        this.setState({ Texts: texts });
    }

    removeFromLocals(t: Text) {
        const locals = this.state.Locals.filter(function(el) {
            console.log("removed from locals");
            return t.id != el.id
        });
        saveLocals(locals);
    }

    saveText(t: Text) {
        let x = this;
        this.saveToLocals(t, function() {
            x.saveToRemote(t, function() {
                x.removeFromLocals(t);
            });
        });
    }

const localStorageKey = "local-texts";

function saveLocals(texts: Text[]) {
    localStorage.setItem(localStorageKey, JSON.stringify(texts));
}


function deleteRemote(t: Text, callback: () => void) {
    fetch("/api/text/" + t.id + ".txt", {
        method: "DELETE"
    }).then(
        response => {
            console.log("deleted remotely");
            callback();
        }
    )
        .catch(
            error => alert(error)
        );
}

function getLocals(): Text[] {
    let locals = localStorage.getItem(localStorageKey);
    if (locals == null) {
        return [] as Text[];
    }
    return JSON.parse(locals);
}


function saveBody(locals: Text[], id: string, body: string): Text[] {
    for (let i = 0; i < locals.length; i++) {
        if (locals[i].id === id) {
            locals[i].body = body;
            return locals
        }
    }
    return locals
}

*/

