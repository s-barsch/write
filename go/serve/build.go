package serve

import (
	"net/http"
	"os"

	s "g.rg-s.com/write/go/server"
)

func ServeBuild(w http.ResponseWriter, r *http.Request) {
	if r.URL.Path != "/" {
		file := s.Srv.Paths.Build + r.URL.Path
		_, err := os.Stat(file)
		if err == nil {
			http.ServeFile(w, r, file)
			return
		}
	}
	http.ServeFile(w, r, s.Srv.Paths.Build+"/index.html")
}
