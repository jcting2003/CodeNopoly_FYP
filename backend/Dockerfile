FROM php:8.2-fpm

WORKDIR /var/www

RUN apt-get update && apt-get install -y \
    git \
    nginx \
    unzip \
    zip \
    curl \
    libzip-dev \
    && docker-php-ext-install pdo pdo_mysql zip pcntl

RUN { \
    echo 'opcache.enable=1'; \
    echo 'opcache.enable_cli=1'; \
    echo 'opcache.memory_consumption=192'; \
    echo 'opcache.max_accelerated_files=20000'; \
    echo 'opcache.validate_timestamps=1'; \
    echo 'opcache.revalidate_freq=2'; \
  } > /usr/local/etc/php/conf.d/opcache-dev.ini

COPY --from=composer:2 /usr/bin/composer /usr/bin/composer
COPY docker/nginx.conf /etc/nginx/sites-available/default

COPY . .

RUN composer install

EXPOSE 8000

CMD ["sh", "-c", "php artisan config:cache && php-fpm -D && nginx -g 'daemon off;'"]
