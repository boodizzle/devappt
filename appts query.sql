select appt_id, event_id, person_id, appt_date, begintime, endtime, duration, 
last_name as patLast, first_name as patFirst, description, zip, 
home_phone as phone, details, confirm_ind as confirmed, appt_kept_ind as kept, rendering_provider_id
from appointments;