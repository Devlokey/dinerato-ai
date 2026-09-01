FROM frappe/erpnext:version-15
USER frappe
WORKDIR /home/frappe/frappe-bench
COPY --chown=frappe:frappe ury_ai apps/ury_ai
RUN bench get-app --branch version-15 hrms https://github.com/frappe/hrms.git
RUN bench get-app ury https://github.com/ury-erp/ury.git
