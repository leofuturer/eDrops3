export const responseHTML = `
    <h1><%= title %></h1>
    <% if (typeof content !== 'undefined') { %>
    <p><%= content %></p>
    <% } %>
    <a href="<%= redirectTo %>"><%= redirectToLinkText %></a>
`;
