
curl.request
  url: "https://api.github.com/repos/" + options.owner + "/" + options.repo + "/releases"
  method: "POST"
  headers:
    Accept: "application/vnd.github.manifold-preview"

  user: options.token + ":x-oauth-basic"
  data: JSON.stringify(
    tag_name: data.tag_name
    target_commitish: data.target_commitish or ""
    name: data.name or ""
    body: data.body or ""
    draft: !!data.draft
    prerelease: !!data.prerelease
  )
, (err, stdout) ->
  if err
    done new Error(err)
  else
    reply = undefined
    try
      reply = JSON.parse(stdout)
    if not reply or reply.errors or not reply.id
      done new Error((if reply then reply.message + "\n" + JSON.stringify(reply.errors, null, "  ") else "Problems parsing response."))
    else
      if data.asset
        
        done new Error("Asset error: no file provided.")  unless data.asset.file
        done new Error("Asset error: no content type of the asset provided.")  unless data.asset["Content-Type"]
        
        data.asset.name = data.asset.file.replace(/(.*)\/(.*)$/, "$2")  unless data.asset.name
        
        curl.request
          
          # Upload asset
          url: "https://uploads.github.com/repos/" + options.owner + "/" + options.repo + "/releases/" + reply.id + "/assets?name=" + data.asset.name
          method: "POST"
          headers:
            Accept: "application/vnd.github.manifold-preview"
            "Content-Type": data.asset["Content-Type"]

          user: options.token + ":x-oauth-basic"
          "data-binary": "@" + data.asset.file
        , (err, stdout) ->
          if err
            done new Error(err)
          else
            reply = undefined
            try
              reply = JSON.parse(stdout)
            if not reply or reply.errors or not reply.name
              done new Error((if reply then reply.message + "\n" + JSON.stringify(reply.errors, null, "  ") else "Problems parsing response."))
            else
              grunt.log.ok "Release asset “" + reply.name + "” has been " + reply.state + "."
          done()
          return

      else
        done()
  return

return

return