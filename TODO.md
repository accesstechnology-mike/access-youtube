Move badwords to API route in middleware

Check what the other middleware is doing

Cache user session playlist alongside search term - presumably done in the ...term route?

Use user session cache for next button and isDirect check on play route

Run bad word check on video title, if isDirect is true.

Populate next and back from new searchs on play route (e.g. once we've establed isDirect correctly)

Check mobile viewport, home page and video player

Ensure London deployment on Vercel

Review error logs on Vecel for common issues

Implement global search results cache for all users
