# hexo-tag-graphviz

Use `dot` to generate graphviz static images.

# Requires

- dot / graphviz

# Usage

```
{% graphviz "Caption of the graphviz" %}
digraph {
  A -> B;
}
{% endgraphviz %}
```

The content of the tag will be hashed and that will form the basis of the filename. If the content hasn't changed, the graph won't be re-generated.

# Caveats

Due to the way file watching works, the image generation will cause a new render to start happening. There is a check to prevent it from entering into an infinite regress, but "Reloading browser" will appear twice.

# To do

The html for the created image is in the template `img.ejs`, and it matches pandoc's default output. Allowing a user to override that in either `_config.yml` or the tag itself would be very nice.
