<?
/*
 * PHP NextMuni
 *
 * Author:
 *   Dan Masquelier - http://twitter.com/danmasq
 *
 * API Docs: 
 *   http://www.nextbus.com/xmlFeedDocs/NextBusXMLFeed.pdf
 *   (This class uses the undocumented JSON feed)
 */
class NextMuni {
  const API_BASE = "http://webservices.nextbus.com/service/publicJSONFeed";
  private $options = array();
  static $remote = array(
    'timeout' => 5,
  );

  function __construct(array $options=array()) {
    $this->options = array_merge(array(
      'agency'         => null,    # e.g. 'sf-muni'. Use agency_list() to find.
      'route'          => null,    # routeTag e.g. '38L'.  Use route_list() to find.
      'routes'         => array(), # e.g. array('N', '38L'). For messages()
      'stop_id'        => null,    # e.g. 1111. Use route_config()->stop to find.
      'stops'          => array(), # '$this->route|stopId' e.g. array('{$this->route}|3840', "{$this->route}|4001"). For predictions_multiple
    ), $options);
  }

  function __get($name) {
    return $this->options[$name];
  }

  function __set($name, $value) {
    $this->options[$name] = $value; 
  }

  function agency_list() {
    $api = array(
      'command' => 'agencyList',
    );
    return $this->get($api);
  }

  function route_list() {
    $api = array(
      'command' => 'routeList',
      'a'       => $this->agency,
    );
    return $this->get($api);
  }

  function route_config() {
    $api = array(
      'command' => 'routeConfig',
      'a'       => $this->agency,
      'r'       => $this->route,
    );
    return $this->get($api);
  }

  function predictions() {
    $api = array(
      'command'  => 'predictions',
      'a'        => $this->agency,
      's'        => $this->stop_id,
      'r'        => $this->route,
    );

    return $this->get($api);
  }

  function predictions_multiple() {
    $stops = $this->build_repeating_params($this->stops, 'stops');
    $api = array(
      'command' => 'predictionsForMultiStops',
      'a'       => $this->agency,
      't'       => time(),
      'stops'   => $stops,
    );

    return $this->get($api);
  }

  function schedule() {
    $api = array(
      'a' => $this->agency,
      'r' => $this->route,
    );
    return $this->get($api);
  }

  function messages() {
    $routes = $this->build_repeating_params($this->routes, 'r');
    $api = array(
      'a' => $this->agency,
      'r' => $routes,
    );
    return $this->get($api);
  }

  function vehicle_locations() {
    $api = array(
      'command' => 'vehicleLocations',
      'a'       => $this->agency,
      'r'       => $this->route,
      't'       => time(),
    );
    return $this->get($api);
  }

  private function build_repeating_params($items, $key) {
    # hack to match NextMuni api index-less "stops" keys
    $out = '';
    $len = count($items) - 1;
    foreach ($items as $k => $item) {
      $last = $len == $k ? '' : "&{$key}=";
      $out .= "{$item}{$last}"; 
    }
    return $out;
  }

  private function get($api) {
    $api = urldecode(http_build_query($api, '', '&'));
    $full_url = self::API_BASE .'?'. $api;

    $curl = curl_init();
    $curl_o = array(
      CURLOPT_URL            => $full_url,  
      CURLOPT_RETURNTRANSFER => 1,
      CURLOPT_CONNECTTIMEOUT => self::$remote['timeout'],
    );
    curl_setopt_array($curl, $curl_o);
    $response = curl_exec($curl);
    curl_close($curl);  
    return json_decode($response);
  }
}
