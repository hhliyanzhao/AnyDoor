<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta http-equiv="X-UA-Compatible" content="ie=edge">
  <title>{{title}}</title>
</head>
<body>
  <ul>
    {{#each dir}}
    <li>
    <a href="{{../currentdir}}/{{this}}">{{this}}</a>
    </li>
  {{/each}}

  </ul>

</body>
</html>
