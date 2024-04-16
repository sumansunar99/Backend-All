FROM phpmyadmin/phpmyadmin

# Remove original logo
RUN rm -f /var/www/html/themes/pmahomme/img/logo_left.png

# Copy your logo
COPY logo.png /var/www/html/themes/pmahomme/img/logo_left.png
# Copy your logo
COPY logo.png /var/www/html/themes/pmahomme/img/logo_right.png
COPY header.twig /var/www/html/templates/login/header.twig

